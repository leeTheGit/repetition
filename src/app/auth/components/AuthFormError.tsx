import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
export default function AuthFormError({ state }: { state: { error: string } }) {
    if (state.error)
      return (
        <Alert className="mb-6 border-red-600 text-red-600" >
          <Terminal className="h-4 w-4" />
          <AlertTitle>{state.error}</AlertTitle>
          {/* <AlertDescription>{state.error}</AlertDescription> */}
        </Alert>



        // <div className="w-full p-4 bg-destructive my-4 text-destructive-foreground text-xs">
        //   <h3 className="font-bold">Error</h3>
        //   <p>{state.error}</p>
        // </div>
      );
    return null;
  }
  