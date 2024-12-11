import IDBProvider from "./components/idbprovider";
import Dataspace from "./DataWorkspace/page";
import Tablespace from "./TableWorkspace/page";

export default function Home() {
  return (
    <IDBProvider>
      <main className="container mx-auto p-4">

        <h1 className="text-2xl font-bold mb-4">TableSpace</h1>
        <Tablespace />


        <h1 className="text-2xl font-bold mb-4 mt-4">DataSpace</h1>
        <Dataspace />
      </main>
    </IDBProvider>
  );
}
