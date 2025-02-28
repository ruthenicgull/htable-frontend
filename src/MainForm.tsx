import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import JsonFormatter from "react-json-formatter";
import JSONPretty from "react-json-pretty";

const MainForm = () => {
  const [formData, setFormData] = useState({
    issueDateStart: "",
    issueDateEnd: "",
    reasonForEncounter: "",
    healthcareUnit: "",
    state: "",
    patientAgeStart: "",
    patientAgeEnd: "",
    dischargeDateStart: "",
    dischargeDateEnd: "",
    reasonForDischarge: "",
    problem: "",
    procedure: "",
  });

  const [responseData, setResponseData] = useState({
    compositions: [],
    query: "",
  });

  const [error, setError] = useState(null);

  // const jsonStyle = {
  //   propertyStyle: { color: "red" },
  //   stringStyle: { color: "green" },
  //   numberStyle: { color: "darkorange" },
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8001/api/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      const data = await response.json();

      setResponseData({ compositions: data.compositions, query: data.query });
      setError(null);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch data");
    }
  };

  // Function to convert camelCase to Title Case
  const convertToTitleCase = (str) => {
    return str
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (char) => char.toUpperCase());
  };

  // Group compositions by reasonForEncounter
  const groupedCompositions = responseData.compositions.reduce(
    (acc, composition) => {
      const reason = composition.reasonForEncounter || "Unknown Reason";
      if (!acc[reason]) {
        acc[reason] = [];
      }
      acc[reason].push(composition);
      return acc;
    },
    {}
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center py-8 my-2 bg-gray-200 rounded-lg">
            H-Table
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>{convertToTitleCase(key)}</Label>
                  <Input
                    type={
                      key.includes("Date")
                        ? "date"
                        : key.includes("Age") ||
                          key.includes("Start") ||
                          key.includes("End")
                        ? "number"
                        : "text"
                    }
                    id={key}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    placeholder={`Enter ${key
                      .replace(/([A-Z])/g, " $1")
                      .toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button type="submit" className="w-full max-w-xs">
                Submit
              </Button>
            </div>
          </form>

          {error && (
            <div className="mt-4 text-center text-red-500">{error}</div>
          )}

          {responseData.query && (
            <Card className="my-4">
              <CardHeader>
                <CardTitle>Mongo DB Query</CardTitle>
                <CardContent>
                  {
                    <div className="mt-4 text-left w-fit mx-auto">
                      <JSONPretty
                        id="json-pretty"
                        data={responseData.query}
                      ></JSONPretty>
                    </div>
                  }
                </CardContent>
              </CardHeader>
            </Card>
          )}

          {responseData.compositions.length > 0 && (
            <div className="space-y-6">
              {Object.entries(groupedCompositions).map(
                ([reason, compositions]) => (
                  <Card key={reason}>
                    <CardHeader>
                      <CardTitle className="relative">
                        Search Results - {reason}
                        <span className="text-gray text-sm absolute right-0">
                          {compositions.length} results
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {compositions.length > 0 &&
                                Object.keys(compositions[0]).map((key) => (
                                  <TableHead
                                    key={key}
                                    className="whitespace-nowrap"
                                  >
                                    {convertToTitleCase(key)}
                                  </TableHead>
                                ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {compositions.map((record, index) => (
                              <TableRow key={index}>
                                {Object.keys(record).map((key) => (
                                  <TableCell key={key}>
                                    {typeof record[key] == "object" ? (
                                      <div className="mt-4 text-left w-fit mx-auto">
                                        <JSONPretty
                                          id="json-pretty"
                                          data={record[key]}
                                        ></JSONPretty>
                                      </div>
                                    ) : (
                                      // <JsonFormatter
                                      //   json={record[key]}
                                      //   tabWith={2}
                                      //   jsonStyle={jsonStyle}
                                      // />
                                      record[key] ?? "N/A"
                                    )}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MainForm;
