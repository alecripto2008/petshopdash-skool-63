
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus } from 'lucide-react';

interface InstanceFormProps {
  instanceName: string;
  onInstanceNameChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const InstanceForm = ({
  instanceName,
  onInstanceNameChange,
  onSubmit,
  isLoading
}: InstanceFormProps) => {
  return (
    <>
      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <Label htmlFor="instance-name">Nome da Instância</Label>
          <Input
            id="instance-name"
            placeholder="Ex: Atendimento Principal"
            className="dark:bg-gray-700"
            value={instanceName}
            onChange={(e) => onInstanceNameChange(e.target.value)}
          />
        </div>
      </div>

      <div className="pt-4">
        <Button
          onClick={onSubmit}
          className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Criando...
            </span>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Criar Instância
            </>
          )}
        </Button>
      </div>
    </>
  );
};
