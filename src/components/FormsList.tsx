import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Form } from '@/pages/Index';
import { Badge } from '@/components/ui/badge';

interface FormsListProps {
  forms: Form[];
  onEdit: (form: Form) => void;
  onDelete: (formId: string) => void;
}

const FormsList = ({ forms, onEdit, onDelete }: FormsListProps) => {
  const copyFormLink = (formId: string) => {
    const link = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(link);
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {forms.map((form) => (
        <Card 
          key={form.id} 
          className="p-6 bg-white/80 backdrop-blur-sm hover-scale cursor-pointer group"
          onClick={() => onEdit(form)}
        >
          <div className="flex items-start justify-between mb-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${form.customization.primaryColor}, ${form.customization.secondaryColor})`
              }}
            >
              <Icon name="FileText" className="text-white" size={24} />
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  copyFormLink(form.id);
                }}
              >
                <Icon name="Link" size={16} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(form.id);
                }}
                className="text-destructive hover:text-destructive"
              >
                <Icon name="Trash2" size={16} />
              </Button>
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-2">{form.title}</h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {form.description}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="MessageSquare" size={16} />
              <span>{form.responsesCount} ответов</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {form.fields.length} полей
            </Badge>
          </div>
        </Card>
      ))}
      
      {forms.length === 0 && (
        <Card className="col-span-full p-12 text-center bg-white/80 backdrop-blur-sm">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center mx-auto mb-4">
            <Icon name="FileQuestion" size={40} className="text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Создайте свою первую форму</h3>
          <p className="text-muted-foreground">
            Нажмите кнопку "Создать форму" чтобы начать
          </p>
        </Card>
      )}
    </div>
  );
};

export default FormsList;
