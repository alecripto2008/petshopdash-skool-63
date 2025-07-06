import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

export const UserManualPDF: React.FC = () => {
  const generatePDF = () => {
    try {
      const pdf = new jsPDF();
      
      // Configurações
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const lineHeight = 7;
      let yPosition = 30;
      
      // Função para adicionar texto com quebra de linha automática
      const addText = (text: string, fontSize: number = 11, isBold: boolean = false) => {
        if (isBold) {
          pdf.setFont('helvetica', 'bold');
        } else {
          pdf.setFont('helvetica', 'normal');
        }
        pdf.setFontSize(fontSize);
        
        const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
        lines.forEach((line: string) => {
          if (yPosition > 280) {
            pdf.addPage();
            yPosition = 30;
          }
          pdf.text(line, margin, yPosition);
          yPosition += lineHeight;
        });
        yPosition += 3; // Espaço extra após cada seção
      };

      // Título
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.text('Manual do Usuário - Perfil Gerente', pageWidth / 2, 20, { align: 'center' });
      yPosition = 40;

      // Conteúdo do manual
      addText('1. VISÃO GERAL DO PERFIL GERENTE', 16, true);
      addText('O perfil de Gerente possui acesso intermediário ao sistema, permitindo gerenciar a maioria das funcionalidades operacionais, mas com algumas restrições em recursos administrativos avançados.');

      addText('2. FUNCIONALIDADES DISPONÍVEIS', 16, true);

      addText('2.1. Dashboard Principal', 14, true);
      addText('• Visualização de métricas e estatísticas do sistema');
      addText('• Acesso rápido a todas as funcionalidades disponíveis');
      addText('• Cards organizados por categoria de acesso');

      addText('2.2. Métricas e Relatórios', 14, true);
      addText('• Visualização de gráficos de crescimento de clientes');
      addText('• Relatórios de métodos de pagamento');
      addText('• Estatísticas de tipos de pets e serviços');
      addText('• Tabela de clientes recentes');
      addText('• Gráficos de barras de serviços');

      addText('2.3. Gerenciamento de Clientes', 14, true);
      addText('• Visualizar lista completa de clientes');
      addText('• Adicionar novos clientes ao sistema');
      addText('• Editar informações de clientes existentes');
      addText('• Pesquisar clientes por nome, email ou telefone');
      addText('• Visualizar detalhes completos do cliente');
      addText('• Enviar mensagens para clientes');

      addText('2.4. Sistema de Chat', 14, true);
      addText('• Visualizar todas as conversas do sistema');
      addText('• Responder mensagens de clientes');
      addText('• Gerenciar histórico de conversas');
      addText('• Visualizar informações do cliente durante o chat');

      addText('2.5. Base de Conhecimento', 14, true);
      addText('• Adicionar novos documentos à base de conhecimento');
      addText('• Editar documentos existentes');
      addText('• Organizar conteúdo por categorias');
      addText('• Pesquisar documentos');
      addText('• Excluir documentos não utilizados');

      addText('2.6. Gerenciamento de Produtos', 14, true);
      addText('• Adicionar novos produtos ao catálogo');
      addText('• Editar informações de produtos');
      addText('• Organizar produtos por categorias');
      addText('• Pesquisar produtos');
      addText('• Gerenciar estoque e preços');

      addText('2.7. Agenda e Agendamentos', 14, true);
      addText('• Visualizar calendário de agendamentos');
      addText('• Criar novos agendamentos');
      addText('• Editar agendamentos existentes');
      addText('• Gerenciar disponibilidade');
      addText('• Visualizar histórico de agendamentos');

      addText('2.8. Controle de Pagamentos', 14, true);
      addText('• Visualizar histórico de pagamentos');
      addText('• Acompanhar status de pagamentos');
      addText('• Gerar relatórios financeiros');
      addText('• Controlar recebimentos');

      addText('2.9. Gerenciamento de Usuários', 14, true);
      addText('• Visualizar lista de usuários do sistema');
      addText('• Adicionar novos usuários');
      addText('• Editar informações básicas de usuários');
      addText('• Alterar permissões de usuários (limitado)');
      addText('• Excluir usuários com perfis "Usuário" ou "Visualizador"');

      addText('3. RESTRIÇÕES E LIMITAÇÕES', 16, true);

      addText('3.1. Funcionalidades Restritas', 14, true);
      addText('• Evolution API: Acesso negado - apenas administradores');
      addText('• Configurações do Sistema: Acesso negado - apenas administradores');
      addText('• Custos de Token: Acesso negado - apenas administradores');

      addText('3.2. Limitações no Gerenciamento de Usuários', 14, true);
      addText('• Não pode excluir usuários com perfil "Gerente" ou "Administrador"');
      addText('• Não pode alterar permissões para níveis superiores ao próprio');
      addText('• Limitado a gerenciar usuários de níveis inferiores');

      addText('4. HIERARQUIA DE PERMISSÕES', 16, true);
      addText('Administrador > Gerente > Usuário > Visualizador');
      addText('');
      addText('• Visualizador: Apenas visualização');
      addText('• Usuário: Acesso básico com algumas funcionalidades');
      addText('• Gerente: Acesso intermediário (seu perfil atual)');
      addText('• Administrador: Acesso total ao sistema');

      addText('5. NAVEGAÇÃO DO SISTEMA', 16, true);

      addText('5.1. Menu Principal', 14, true);
      addText('• Dashboard: Página inicial com visão geral');
      addText('• Métricas: Relatórios e estatísticas');
      addText('• Clientes: Gerenciamento de clientes');
      addText('• Chats: Sistema de conversas');
      addText('• Conhecimento: Base de documentos');
      addText('• Produtos: Catálogo de produtos');
      addText('• Agenda: Sistema de agendamentos');
      addText('• Pagamentos: Controle financeiro');
      addText('• Usuários: Gerenciamento de usuários');

      addText('5.2. Funcionalidades Gerais', 14, true);
      addText('• Alternância entre tema claro e escuro');
      addText('• Pesquisa em todas as seções');
      addText('• Filtros e ordenação');
      addText('• Exportação de dados');
      addText('• Notificações em tempo real');

      addText('6. DICAS DE USO', 16, true);
      addText('• Utilize a barra de pesquisa para encontrar informações rapidamente');
      addText('• Mantenha as informações de clientes sempre atualizadas');
      addText('• Verifique regularmente os agendamentos do dia');
      addText('• Utilize a base de conhecimento para padronizar respostas');
      addText('• Monitore os relatórios para identificar tendências');

      addText('7. SUPORTE', 16, true);
      addText('Para dúvidas ou problemas técnicos, entre em contato com o administrador do sistema.');

      // Rodapé
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Página ${i} de ${pageCount}`, pageWidth - margin, 290, { align: 'right' });
        pdf.text('Manual do Usuário - Perfil Gerente', margin, 290);
      }

      // Salvar o PDF
      pdf.save('Manual_Usuario_Gerente.pdf');
      toast.success('PDF do manual gerado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar o PDF. Tente novamente.');
    }
  };

  return (
    <Button 
      onClick={generatePDF}
      className="flex items-center gap-2"
      variant="outline"
    >
      <Download className="w-4 h-4" />
      Baixar Manual do Usuário (PDF)
    </Button>
  );
};