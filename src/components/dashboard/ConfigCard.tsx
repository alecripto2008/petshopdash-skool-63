
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ConfigCard() {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Configurações</CardTitle>
        <Settings className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="text-2xl font-bold">Sistema</div>
          <p className="text-xs text-muted-foreground">
            Gerencie webhooks e outras configurações do sistema
          </p>
        </div>
        <div className="mt-4">
          <Button 
            onClick={() => navigate("/config")} 
            variant="outline" 
            size="sm"
            className="w-full"
          >
            <Settings className="mr-2 h-4 w-4" />
            Acessar Configurações
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
