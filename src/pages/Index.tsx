import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import FormEditor from '@/components/FormEditor';
import FormsList from '@/components/FormsList';
import FormPreview from '@/components/FormPreview';

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'select' | 'checkbox' | 'textarea';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

export interface Form {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  customization: {
    primaryColor: string;
    secondaryColor: string;
    logo?: string;
  };
  createdAt: Date;
  responsesCount: number;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('forms');
  const [forms, setForms] = useState<Form[]>([
    {
      id: '1',
      title: 'Форма обратной связи',
      description: 'Соберите отзывы от ваших клиентов',
      fields: [
        { id: 'f1', type: 'text', label: 'Имя', placeholder: 'Введите ваше имя', required: true },
        { id: 'f2', type: 'email', label: 'Email', placeholder: 'example@mail.com', required: true },
        { id: 'f3', type: 'textarea', label: 'Сообщение', placeholder: 'Ваш отзыв...', required: true },
      ],
      customization: {
        primaryColor: '#9b87f5',
        secondaryColor: '#D946EF',
      },
      createdAt: new Date(),
      responsesCount: 12,
    },
  ]);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleCreateForm = () => {
    const newForm: Form = {
      id: Date.now().toString(),
      title: 'Новая форма',
      description: 'Описание формы',
      fields: [],
      customization: {
        primaryColor: '#9b87f5',
        secondaryColor: '#D946EF',
      },
      createdAt: new Date(),
      responsesCount: 0,
    };
    setForms([...forms, newForm]);
    setSelectedForm(newForm);
    setIsEditing(true);
  };

  const handleSaveForm = (updatedForm: Form) => {
    setForms(forms.map(f => f.id === updatedForm.id ? updatedForm : f));
    setSelectedForm(updatedForm);
    setIsEditing(false);
  };

  const handleDeleteForm = (formId: string) => {
    setForms(forms.filter(f => f.id !== formId));
    if (selectedForm?.id === formId) {
      setSelectedForm(null);
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-purple-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Icon name="FormInput" className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                FormBuilder
              </h1>
            </div>
            <Button 
              onClick={handleCreateForm}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
            >
              <Icon name="Plus" size={18} className="mr-2" />
              Создать форму
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="forms" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
              <Icon name="LayoutGrid" size={18} className="mr-2" />
              Мои формы
            </TabsTrigger>
            <TabsTrigger value="responses" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
              <Icon name="MessageSquare" size={18} className="mr-2" />
              Ответы
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
              <Icon name="Settings" size={18} className="mr-2" />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="forms" className="animate-fade-in">
            {isEditing && selectedForm ? (
              <div className="grid lg:grid-cols-2 gap-6">
                <FormEditor 
                  form={selectedForm} 
                  onSave={handleSaveForm}
                  onCancel={() => {
                    setIsEditing(false);
                    setSelectedForm(null);
                  }}
                />
                <FormPreview form={selectedForm} />
              </div>
            ) : (
              <FormsList 
                forms={forms} 
                onEdit={(form) => {
                  setSelectedForm(form);
                  setIsEditing(true);
                }}
                onDelete={handleDeleteForm}
              />
            )}
          </TabsContent>

          <TabsContent value="responses" className="animate-fade-in">
            <Card className="p-8 text-center bg-white/80 backdrop-blur-sm">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mx-auto mb-4">
                <Icon name="Inbox" size={40} className="text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Пока нет ответов</h3>
              <p className="text-muted-foreground">
                Здесь будут отображаться ответы пользователей на ваши формы
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="animate-fade-in">
            <Card className="p-8 bg-white/80 backdrop-blur-sm max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Icon name="User" size={24} />
                Профиль
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Имя</Label>
                  <Input id="name" placeholder="Ваше имя" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" className="mt-2" />
                </div>
                <Button className="bg-gradient-to-r from-primary to-secondary text-white">
                  Сохранить изменения
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
