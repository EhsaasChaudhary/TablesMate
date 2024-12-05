
import { TableDataForm } from "./components/dynamictableform"

// import InputForm from "./components/dynamictableform";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dynamic Table</h1>
      <TableDataForm/>
      {/* <InputForm/> */}
    </main>
  )
}

