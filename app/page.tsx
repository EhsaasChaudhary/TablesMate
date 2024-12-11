import IDBProvider from "./components/idbprovider"; // Capitalized component name
import { EnhancedInputForm } from "./components/multitableform";
// import Tablespace from "./TableWorkspace/page";

export default function Home() {
  return (
    <IDBProvider>
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Dynamic Table</h1>
        <EnhancedInputForm />

        {/* <h1 className="text-2xl font-bold mb-4">Tablespace</h1>
        <Tablespace/> */}
      </main>
    </IDBProvider>
  );
}
