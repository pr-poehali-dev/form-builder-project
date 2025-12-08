import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { Form, FormField } from '@/pages/Index';
import { Separator } from '@/components/ui/separator';

interface FormEditorProps {
  form: Form;
  onSave: (form: Form) => void;
  onCancel: () => void;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Текст', icon: 'Type' },
  { value: 'email', label: 'Email', icon: 'Mail' },
  { value: 'textarea', label: 'Текстовое поле', icon: 'AlignLeft' },
  { value: 'select', label: 'Выбор', icon: 'List' },
  { value: 'checkbox', label: 'Чекбокс', icon: 'CheckSquare' },
] as const;

const FormEditor = ({ form, onSave, onCancel }: FormEditorProps) => {
  const [editedForm, setEditedForm] = useState<Form>(form);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: 'Новое поле',
      placeholder: '',
      required: false,
      options: type === 'select' ? ['Вариант 1', 'Вариант 2'] : undefined,
    };
    setEditedForm({
      ...editedForm,
      fields: [...editedForm.fields, newField],
    });
    setSelectedFieldId(newField.id);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setEditedForm({
      ...editedForm,
      fields: editedForm.fields.map(f => 
        f.id === fieldId ? { ...f, ...updates } : f
      ),
    });
  };

  const deleteField = (fieldId: string) => {
    setEditedForm({
      ...editedForm,
      fields: editedForm.fields.filter(f => f.id !== fieldId),
    });
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  };

  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    const index = editedForm.fields.findIndex(f => f.id === fieldId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === editedForm.fields.length - 1)
    ) return;

    const newFields = [...editedForm.fields];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
    
    setEditedForm({
      ...editedForm,
      fields: newFields,
    });
  };

  const selectedField = editedForm.fields.find(f => f.id === selectedFieldId);

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Icon name="Edit3" size={24} />
          Редактор формы
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button 
            onClick={() => onSave(editedForm)}
            className="bg-gradient-to-r from-primary to-secondary text-white"
          >
            <Icon name="Save" size={18} className="mr-2" />
            Сохранить
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="title">Название формы</Label>
          <Input
            id="title"
            value={editedForm.title}
            onChange={(e) => setEditedForm({ ...editedForm, title: e.target.value })}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            value={editedForm.description}
            onChange={(e) => setEditedForm({ ...editedForm, description: e.target.value })}
            className="mt-2"
          />
        </div>

        <Separator />

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Поля формы</h3>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {FIELD_TYPES.map((type) => (
              <Button
                key={type.value}
                variant="outline"
                onClick={() => addField(type.value as FormField['type'])}
                className="justify-start"
              >
                <Icon name={type.icon as any} size={18} className="mr-2" />
                {type.label}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            {editedForm.fields.map((field, index) => (
              <div
                key={field.id}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedFieldId === field.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedFieldId(field.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon 
                      name={FIELD_TYPES.find(t => t.value === field.type)?.icon as any} 
                      size={18} 
                      className="text-primary"
                    />
                    <div>
                      <div className="font-medium">{field.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {FIELD_TYPES.find(t => t.value === field.type)?.label}
                        {field.required && ' • Обязательное'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveField(field.id, 'up');
                      }}
                      disabled={index === 0}
                    >
                      <Icon name="ChevronUp" size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveField(field.id, 'down');
                      }}
                      disabled={index === editedForm.fields.length - 1}
                    >
                      <Icon name="ChevronDown" size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteField(field.id);
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>

                {selectedFieldId === field.id && selectedField && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    <div>
                      <Label>Метка поля</Label>
                      <Input
                        value={selectedField.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Подсказка (placeholder)</Label>
                      <Input
                        value={selectedField.placeholder || ''}
                        onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Обязательное поле</Label>
                      <Switch
                        checked={selectedField.required}
                        onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                      />
                    </div>
                    {selectedField.type === 'select' && (
                      <div>
                        <Label>Варианты (по одному на строку)</Label>
                        <Textarea
                          value={selectedField.options?.join('\n') || ''}
                          onChange={(e) => updateField(field.id, { 
                            options: e.target.value.split('\n').filter(o => o.trim()) 
                          })}
                          className="mt-2"
                          rows={4}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {editedForm.fields.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="MousePointerClick" size={40} className="mx-auto mb-2 opacity-50" />
              <p>Добавьте поля, нажав на кнопки выше</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default FormEditor;
