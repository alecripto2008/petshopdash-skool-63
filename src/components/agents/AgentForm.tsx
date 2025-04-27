
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { AgentFormValues } from '@/types/agent';

const agentFormSchema = z.object({
  industry: z.string().min(3, {
    message: "O nicho/indústria deve ter pelo menos 3 caracteres.",
  }),
  company: z.string().min(2, {
    message: "O nome da empresa deve ter pelo menos 2 caracteres.",
  }),
  mainProduct: z.string().min(5, {
    message: "A descrição do produto/serviço deve ter pelo menos 5 caracteres.",
  }),
  strategy: z.string().min(10, {
    message: "A estratégia deve ter pelo menos 10 caracteres.",
  }),
  name: z.string().min(2, {
    message: "O nome do agente deve ter pelo menos 2 caracteres.",
  }),
  personality: z.string().min(10, {
    message: "A descrição da personalidade deve ter pelo menos 10 caracteres.",
  }),
  objective: z.string().min(10, {
    message: "O objetivo deve ter pelo menos 10 caracteres.",
  }),
  thinkingStyle: z.string().min(5, {
    message: "O estilo de pensamento deve ter pelo menos 5 caracteres.",
  }),
});

interface AgentFormProps {
  onSubmit: (data: AgentFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const AgentForm = ({ onSubmit, onCancel, isSubmitting }: AgentFormProps) => {
  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      industry: "",
      company: "",
      mainProduct: "",
      strategy: "",
      name: "",
      personality: "",
      objective: "",
      thinkingStyle: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qual é o nicho ou indústria para este prompt?</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Pet Shop, Imobiliária, Restaurante" {...field} />
              </FormControl>
              <FormDescription>
                O setor ou segmento de mercado onde o agente irá atuar.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qual é o nome da nova empresa?</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Pet Paradise, Casa & Lar, Sabor Gourmet" {...field} />
              </FormControl>
              <FormDescription>
                O nome da empresa que o agente irá representar.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mainProduct"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qual é o principal produto ou serviço oferecido?</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Ex: Produtos para pets, Venda de imóveis, Refeições gourmet" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Os produtos ou serviços que a empresa oferece aos clientes.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="strategy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qual é a estratégia para atendimento e vendas?</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Ex: Atendimento personalizado com foco no bem-estar animal" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                A abordagem que o agente deve utilizar para atender e vender.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qual deve ser o nome do agente?</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Nina, Carlos, Marina" {...field} />
              </FormControl>
              <FormDescription>
                O nome que o assistente virtual usará para se identificar.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quais são os principais traços de personalidade do agente?</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Ex: Amigável, paciente, conhecedor de animais e seus comportamentos" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Como o agente deve se comportar e se comunicar.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="objective"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qual é o objetivo central do agente?</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Ex: Aumentar vendas e fidelizar clientes com atendimento superior" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                O propósito principal do agente na interação com clientes.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thinkingStyle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>O agente deve pensar como quem?</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Uma especialista em animais que ama pets" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                A mentalidade ou perspectiva que o agente deve adotar.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                Criando...
              </>
            ) : (
              'Criar Agente'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
