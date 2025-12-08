import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { Form } from '@/pages/Index';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

interface FormPreviewProps {
  form: Form;
}

const FormPreview = ({ form }: FormPreviewProps) => {
  const [customPrimaryColor, setCustomPrimaryColor] = useState(form.customization.primaryColor);
  const [customSecondaryColor, setCustomSecondaryColor] = useState(form.customization.secondaryColor);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/80 backdrop-blur-sm animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Icon name="Eye" size={24} />
          Предпросмотр и кастомизация
        </h2>

        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="preview">
              <Icon name="Eye" size={16} className="mr-2" />
              Предпросмотр
            </TabsTrigger>
            <TabsTrigger value="customize">
              <Icon name="Palette" size={16} className="mr-2" />
              Кастомизация
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <div 
              className="p-8 rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${customPrimaryColor}15, ${customSecondaryColor}15)`
              }}
            >
              <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <div className="mb-6">
                  <h3 className="text-3xl font-bold mb-2" style={{ color: customPrimaryColor }}>
                    {form.title}
                  </h3>
                  <p className="text-muted-foreground">{form.description}</p>
                </div>

                <div className="space-y-6">
                  {form.fields.map((field) => (
                    <div key={field.id}>
                      <Label className="mb-2 block">
                        {field.label}
                        {field.required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                      
                      {field.type === 'text' && (
                        <Input placeholder={field.placeholder} />
                      )}
                      
                      {field.type === 'email' && (
                        <Input type="email" placeholder={field.placeholder} />
                      )}
                      
                      {field.type === 'textarea' && (
                        <Textarea placeholder={field.placeholder} rows={4} />
                      )}
                      
                      {field.type === 'select' && (
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите вариант" />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option, idx) => (
                              <SelectItem key={idx} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      
                      {field.type === 'checkbox' && (
                        <div className="flex items-center gap-2">
                          <Checkbox id={field.id} />
                          <Label htmlFor={field.id} className="cursor-pointer">
                            {field.placeholder || 'Согласен'}
                          </Label>
                        </div>
                      )}
                    </div>
                  ))}

                  {form.fields.length > 0 && (
                    <Button 
                      className="w-full text-white"
                      style={{
                        background: `linear-gradient(135deg, ${customPrimaryColor}, ${customSecondaryColor})`
                      }}
                    >
                      Отправить
                    </Button>
                  )}

                  {form.fields.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Icon name="FileQuestion" size={40} className="mx-auto mb-2 opacity-50" />
                      <p>Добавьте поля в редакторе</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0" />
              <p className="text-sm text-blue-900">
                Ссылка для публикации: <code className="bg-white px-2 py-1 rounded text-xs">
                  {window.location.origin}/form/{form.id}
                </code>
              </p>
            </div>
          </TabsContent>

          <TabsContent value="customize" className="space-y-6">
            <div>
              <Label className="mb-3 block">Основной цвет</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  value={customPrimaryColor}
                  onChange={(e) => setCustomPrimaryColor(e.target.value)}
                  className="w-20 h-12 cursor-pointer"
                />
                <Input
                  type="text"
                  value={customPrimaryColor}
                  onChange={(e) => setCustomPrimaryColor(e.target.value)}
                  placeholder="#9b87f5"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Дополнительный цвет</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  value={customSecondaryColor}
                  onChange={(e) => setCustomSecondaryColor(e.target.value)}
                  className="w-20 h-12 cursor-pointer"
                />
                <Input
                  type="text"
                  value={customSecondaryColor}
                  onChange={(e) => setCustomSecondaryColor(e.target.value)}
                  placeholder="#D946EF"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { primary: '#9b87f5', secondary: '#D946EF', name: 'Purple Dream' },
                { primary: '#0EA5E9', secondary: '#06B6D4', name: 'Ocean Blue' },
                { primary: '#F97316', secondary: '#EF4444', name: 'Sunset' },
                { primary: '#10B981', secondary: '#14B8A6', name: 'Fresh Green' },
                { primary: '#8B5CF6', secondary: '#A855F7', name: 'Deep Purple' },
                { primary: '#EC4899', secondary: '#F43F5E', name: 'Pink Passion' },
              ].map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setCustomPrimaryColor(preset.primary);
                    setCustomSecondaryColor(preset.secondary);
                  }}
                  className="p-3 rounded-lg border-2 hover:border-primary transition-all group"
                >
                  <div
                    className="w-full h-12 rounded-md mb-2"
                    style={{
                      background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`
                    }}
                  />
                  <p className="text-xs font-medium text-center">{preset.name}</p>
                </button>
              ))}
            </div>

            <div>
              <Label className="mb-3 block">Логотип</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                <Icon name="Upload" size={32} className="mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Нажмите для загрузки логотипа
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG до 2MB
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default FormPreview;
