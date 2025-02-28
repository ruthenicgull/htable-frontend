import "./App.css";
import ArchitypeTree from "./ArchetypeTree";
import chemotherapyModel from "./models/chemotherapy.model.json";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HierachicalForm from "./HierarchicalForm";
import { useState } from "react";
import axios from "axios";
import { Card } from "./components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { log } from "console";

interface ChemotherapyEncounter {
  issueDate: string;
  reasonForEncounter: string;
  healthcareUnit: string;
  state: string;
  patientAge: string;
  associatedCauses: string;
  chemotherapyStartDate: string;
  clinicalStaging: { type: string; value: string };
  invasedRegionalLymphNodes: string;
  pathologicalStaging: {
    histopathologicalGrading: string;
    pathologicalIdentificationDate: string;
  };
  primaryDiagnosis: string;
  primaryDiagnosisCode: string;
  procedure: string;
  procedureCode: string;
  schema: string;
  secondaryDiagnosis: string;
  topography: string;
  treatmentDuration: string;
  treatmentDurationUnits: string;
}

function App() {
  const [chemoFormState, setChemoFormState] = useState({
    "issue date-start": "",
    "issue date-end": "",
    "healthcare unit": "",
    State: "",
    "patient age-start": "",
    "patient age-end": "",
    "duration of treatment-start": "",
    "duration of treatment-end": "",
    schema: "",
    "date of beginning of chemotherapy-start": "",
    "date of beginning of chemotherapy-end": "",
    "date of discharge-start": "",
    "date of discharge-end": "",
    "reason for discharge": "",
    Problem: "",
    "Secondary Diagnosis": "",
    "Associated Causes": "",
    "Invaded regional linphonodes": "",
    "Clinical Staging": "",
    "Histopathological grading (G)": "",
    "date of pathological identification-start": "",
    "date of pathological identification-end": "",
    topography: "",
    Procedure: "",
  });
  const [compositions, setCompositions] = useState<ChemotherapyEncounter[]>([]);

  async function fetchChemoEHRs() {
    const url = "http://localhost:8001/api/filter/chemo";
    const startTime = performance.now(); // Start time

    try {
      const response = await axios.post(url, { filters: chemoFormState });
      const data = await response.data;

      const endTime = performance.now(); // End time
      console.log(`Retrieval Time: ${(endTime - startTime).toFixed(2)} ms`);
      setCompositions(data.compositions);
      console.log("Query Results:", data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleChemoInputChange = (name: string, value: string) => {
    setChemoFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-900 py-4">H - Table</h1>
      <Tabs defaultValue="chemotherapy-1" className="flex-1">
        <TabsList className="w-full">
          <TabsTrigger value="chemotherapy-1" className="flex-1">
            Chemotherapy
          </TabsTrigger>
          <TabsTrigger value="chemotherapy-2" className="flex-1">
            Bariatrics
          </TabsTrigger>
          <TabsTrigger value="radiotherapy" className="flex-1">
            Radiotherapy
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chemotherapy-1">
          <HierachicalForm
            formState={chemoFormState}
            fetchEHRs={fetchChemoEHRs}
            handleInputChange={handleChemoInputChange}
            formStructure={chemotherapyModel}
          />
        </TabsContent>
        <TabsContent value="chemotherapy-2">
          {/* <ArchitypeTree data={bariatricsModel} /> */}
          <ArchitypeTree data={chemotherapyModel} />
        </TabsContent>
        <TabsContent value="radiotherapy">
          {/* <ArchitypeTree data={radiotherapyModel} /> */}
        </TabsContent>
      </Tabs>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Issue Date</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Healthcare Unit</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Associated Causes</TableHead>
              <TableHead>Chemotherapy Start</TableHead>
              <TableHead>Clinical Staging</TableHead>
              <TableHead>Invased Lymph Nodes</TableHead>
              <TableHead>Pathological Staging</TableHead>
              <TableHead>Primary Diagnosis</TableHead>
              <TableHead>Procedure</TableHead>
              <TableHead>Schema</TableHead>
              <TableHead>Treatment Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {compositions.map((composition, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{composition?.issueDate}</TableCell>
                  <TableCell>{composition?.reasonForEncounter}</TableCell>
                  <TableCell>{composition?.healthcareUnit}</TableCell>
                  <TableCell>{composition?.state}</TableCell>
                  <TableCell>{composition?.patientAge}</TableCell>
                  <TableCell>{composition?.associatedCauses}</TableCell>
                  <TableCell>{composition?.chemotherapyStartDate}</TableCell>
                  <TableCell>{composition?.clinicalStaging?.value}</TableCell>
                  <TableCell>
                    {composition?.invasedRegionalLymphNodes}
                  </TableCell>
                  <TableCell>
                    {composition?.pathologicalStaging?.histopathologicalGrading}
                  </TableCell>
                  <TableCell>{composition?.primaryDiagnosis}</TableCell>
                  <TableCell>{composition?.procedure}</TableCell>
                  <TableCell>{composition?.schema}</TableCell>
                  <TableCell>
                    {composition?.treatmentDuration}{" "}
                    {composition?.treatmentDurationUnits}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* <MainForm /> */}
    </>
  );
}

export default App;
