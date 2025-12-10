import json
import os
import psycopg2
from typing import Dict, Any

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для управления формами: создание, чтение, обновление форм и сохранение ответов
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        query_params = event.get('queryStringParameters', {})
        action = query_params.get('action', 'list')
        
        if method == 'GET':
            if action == 'list':
                cur.execute('''
                    SELECT 
                        f.id, 
                        f.title, 
                        f.description, 
                        f.fields, 
                        f.customization,
                        f.created_at,
                        f.updated_at,
                        COUNT(r.id) as response_count
                    FROM forms f
                    LEFT JOIN responses r ON f.id = r.form_id
                    GROUP BY f.id
                    ORDER BY f.created_at DESC
                ''')
                
                forms = []
                for row in cur.fetchall():
                    forms.append({
                        'id': row[0],
                        'title': row[1],
                        'description': row[2],
                        'fields': row[3],
                        'customization': row[4],
                        'createdAt': row[5].isoformat() if row[5] else None,
                        'updatedAt': row[6].isoformat() if row[6] else None,
                        'responseCount': row[7]
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'forms': forms}),
                    'isBase64Encoded': False
                }
            
            elif action == 'get':
                form_id = query_params.get('id')
                if not form_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Form ID required'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute('''
                    SELECT id, title, description, fields, customization, created_at, updated_at
                    FROM forms WHERE id = %s
                ''', (form_id,))
                
                row = cur.fetchone()
                if not row:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Form not found'}),
                        'isBase64Encoded': False
                    }
                
                form = {
                    'id': row[0],
                    'title': row[1],
                    'description': row[2],
                    'fields': row[3],
                    'customization': row[4],
                    'createdAt': row[5].isoformat() if row[5] else None,
                    'updatedAt': row[6].isoformat() if row[6] else None
                }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(form),
                    'isBase64Encoded': False
                }
            
            elif action == 'responses':
                form_id = query_params.get('id')
                if not form_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Form ID required'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute('''
                    SELECT id, response_data, submitted_at
                    FROM responses
                    WHERE form_id = %s
                    ORDER BY submitted_at DESC
                ''', (form_id,))
                
                responses = []
                for row in cur.fetchall():
                    responses.append({
                        'id': row[0],
                        'data': row[1],
                        'submittedAt': row[2].isoformat() if row[2] else None
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'responses': responses}),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            if action == 'create':
                form_id = body_data.get('id')
                title = body_data.get('title', 'Новая форма')
                description = body_data.get('description', '')
                fields = json.dumps(body_data.get('fields', []))
                customization = json.dumps(body_data.get('customization', {'primaryColor': '#9b87f5', 'secondaryColor': '#D946EF'}))
                
                cur.execute('''
                    INSERT INTO forms (id, title, description, fields, customization)
                    VALUES (%s, %s, %s, %s::jsonb, %s::jsonb)
                    ON CONFLICT (id) DO UPDATE SET
                        title = EXCLUDED.title,
                        description = EXCLUDED.description,
                        fields = EXCLUDED.fields,
                        customization = EXCLUDED.customization,
                        updated_at = NOW()
                    RETURNING id
                ''', (form_id, title, description, fields, customization))
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'id': form_id}),
                    'isBase64Encoded': False
                }
            
            elif action == 'submit':
                form_id = body_data.get('formId')
                response_data = json.dumps(body_data.get('data', {}))
                
                if not form_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Form ID required'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute('''
                    INSERT INTO responses (form_id, response_data)
                    VALUES (%s, %s::jsonb)
                    RETURNING id
                ''', (form_id, response_data))
                
                response_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'id': response_id}),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid request'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()