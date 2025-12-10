const API_URL = 'https://functions.poehali.dev/f4a6a8a2-350b-4d51-b0b5-5051a709c4cc';

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
  createdAt?: string;
  updatedAt?: string;
  responseCount?: number;
}

export const api = {
  async listForms(): Promise<Form[]> {
    const response = await fetch(`${API_URL}?action=list`);
    const data = await response.json();
    return data.forms || [];
  },

  async getForm(id: string): Promise<Form> {
    const response = await fetch(`${API_URL}?action=get&id=${id}`);
    return await response.json();
  },

  async saveForm(form: Form): Promise<void> {
    await fetch(`${API_URL}?action=create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
  },

  async submitResponse(formId: string, data: Record<string, any>): Promise<void> {
    await fetch(`${API_URL}?action=submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formId, data }),
    });
  },

  async getResponses(formId: string): Promise<any[]> {
    const response = await fetch(`${API_URL}?action=responses&id=${formId}`);
    const data = await response.json();
    return data.responses || [];
  },
};
