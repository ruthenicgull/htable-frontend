import "./App.css";
import ArchitypeTree from "./ArchetypeTree";
import MainForm from "./MainForm";
import chemotherapyModel from "./models/chemotherapy.model.json";
import bariatricsModel from "./models/bariatrics.model.json";
import radiotherapyModel from "./models/radiotherapy.model.json";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function App() {
  return (
    <>
      <Tabs defaultValue="chemotherapy">
        <TabsList>
          <TabsTrigger value="chemotherapy">Chemotherapy</TabsTrigger>
          <TabsTrigger value="bariatrics">Bariatrics</TabsTrigger>
          <TabsTrigger value="radiotherapy">Radiotherapy</TabsTrigger>
        </TabsList>
        <TabsContent value="chemotherapy">
          <ArchitypeTree data={chemotherapyModel} />
        </TabsContent>
        <TabsContent value="bariatrics">
          <ArchitypeTree data={bariatricsModel} />
        </TabsContent>
        <TabsContent value="radiotherapy">
          <ArchitypeTree data={radiotherapyModel} />
        </TabsContent>
      </Tabs>
    </>
  );
}

export default App;
