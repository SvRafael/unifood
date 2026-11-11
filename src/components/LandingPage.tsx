import { Link } from "@tanstack/react-router";

export function LandingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-orange-50/50 via-background to-background px-4">
      <div className="flex flex-col items-center text-center max-w-sm w-full animate-in fade-in zoom-in-95 duration-500">
        
        {/* Contêiner da Logo com animação suave */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute -inset-4 rounded-full bg-orange-400/20 blur-xl"></div>
          <img
            src="/assets/unifoodmobile.png"
            alt="Unifood"
            className="relative h-32 w-auto object-contain drop-shadow-md"
          />
        </div>

        {/* Título e Descrição */}
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-['Baloo_2']">
          Uni<span className="text-orange-500">food</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          O marketplace dos alunos empreendedores do seu campus.
        </p>

        {/* Botão de Ação */}
        <div className="mt-8 w-full space-y-3">
          <Link
            to="/login" // ou para onde você quer direcionar (ex: "/feed", "/marketplace")
            className="w-full inline-flex items-center justify-center rounded-xl bg-orange-500 py-3.5 px-6 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-600 hover:shadow-orange-500/40 active:scale-[0.98]"
          >
            Entrar / Começar
          </Link>
        </div>

      </div>
    </div>
  );
}