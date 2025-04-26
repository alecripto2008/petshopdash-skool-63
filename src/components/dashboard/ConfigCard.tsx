
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
        <div className="text-sm text-muted-foreground mb-4">
          Gerencie as configurações do sistema
        </div>
        <Button 
          onClick={() => navigate("/config")} 
          variant="outline" 
          className="w-full"
        >
          Acessar Configurações
        </Button>
      </CardContent>
    </Card>
  );
}
