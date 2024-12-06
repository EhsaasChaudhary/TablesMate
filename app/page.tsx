
// import { TableDataForm } from "./components/dynamictableform"
import { EnhancedInputForm } from "./components/multitableform"




export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dynamic Table</h1>
      {/* <TableDataForm/> */}
      <EnhancedInputForm/>
    </main>
  )
}

