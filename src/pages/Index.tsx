import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import FormEditor from '@/components/FormEditor';
import FormsList from '@/components/FormsList';
import FormPreview from '@/components/FormPreview';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

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
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      setLoading(true);
      const data = await api.listForms();
      setForms(data.map(f => ({
        ...f,
        createdAt: f.createdAt ? new Date(f.createdAt) : new Date(),
        responsesCount: f.responseCount || 0,
      })));
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить формы',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleSaveForm = async (updatedForm: Form) => {
    try {
      await api.saveForm(updatedForm);
      await loadForms();
      setSelectedForm(updatedForm);
      setIsEditing(false);
      toast({
        title: 'Успех',
        description: 'Форма сохранена',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить форму',
        variant: 'destructive',
      });
    }
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
            {loading ? (
              <Card className="p-8 text-center bg-white/80 backdrop-blur-sm">
                <Icon name="Loader2" size={40} className="mx-auto mb-4 animate-spin text-primary" />
                <p className="text-muted-foreground">Загрузка форм...</p>
              </Card>
            ) : isEditing && selectedForm ? (
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