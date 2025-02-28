import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface FormNode {
  name: string;
  fixedValue?: string;
  inputType?: string;
  helpText?: string;
  values?: string[];
  children?: FormNode[];
}

interface FormState {
  [key: string]: string;
}

interface HierarchicalFormProps {
  formState: FormState;
  fetchEHRs: () => void;
  handleInputChange: (name: string, value: string) => void;
  formStructure: FormNode;
}

function HierarchicalForm({
  formState,
  fetchEHRs,
  handleInputChange,
  formStructure,
}: HierarchicalFormProps) {
  const renderNode = (node: FormNode, level: number = 0) => {
    const paddingLeft = `${level * 1}rem`;
    const backgroundColor = `rgb(${250 - level * 20}, ${250 - level * 20}, ${
      250 - level * 20
    })`;

    if (node.fixedValue) {
      return (
        <div
          key={node.name}
          className="mb-4 p-2 flex items-center gap-4"
          style={{ paddingLeft, backgroundColor }}
        >
          <Label className="flex-1 block mb-2">{node.name}</Label>
          <Input value={node.fixedValue} className="flex-1" disabled />
        </div>
      );
    }

    if (!node.children && !node.fixedValue) {
      if (node.inputType === "date") {
        const startName = `${node.name}-start`;
        const endName = `${node.name}-end`;

        return (
          <div
            key={node.name}
            className="mb-4 p-2 flex items-center gap-4"
            style={{ backgroundColor }}
          >
            <Label className="flex-1 block mb-2">{node.name}</Label>
            <div className="flex-1 flex gap-4 items-center">
              <Input
                type="date"
                className="w-fit"
                value={formState[startName]}
                onChange={(e) => handleInputChange(startName, e.target.value)}
              />
              <span>to</span>
              <Input
                type="date"
                className="w-fit"
                value={formState[endName]}
                onChange={(e) => handleInputChange(endName, e.target.value)}
              />
            </div>
          </div>
        );
      }

      if (node.inputType === "range") {
        const startName = `${node.name}-start`;
        const endName = `${node.name}-end`;

        return (
          <div
            key={node.name}
            className="mb-4 p-2 flex items-center gap-4"
            style={{ backgroundColor }}
          >
            <Label className="flex-1 block mb-2">
              {node.name} {node.helpText && `(${node.helpText})`}
            </Label>
            <div className="flex-1 flex gap-4 items-center">
              <Input
                type="text"
                value={formState[startName]}
                onChange={(e) => handleInputChange(startName, e.target.value)}
                className="w-full"
              />
              <span>to</span>
              <Input
                type="text"
                value={formState[endName]}
                onChange={(e) => handleInputChange(endName, e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        );
      }

      if (node.inputType === "select") {
        return (
          <div
            key={node.name}
            className="mb-4 p-2 flex items-center gap-4"
            style={{ backgroundColor }}
          >
            <Label className="flex-1 block mb-2">{node.name}</Label>
            <select
              value={formState[node.name]}
              onChange={(e) => handleInputChange(node.name, e.target.value)}
              className="w-full flex-1 p-2 border border-gray-300 rounded"
            >
              <option value="">-- No Selection --</option>
              {node.values?.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        );
      }

      return (
        <div
          key={node.name}
          className="mb-4 p-2 flex items-center gap-4"
          style={{ backgroundColor }}
        >
          <Label className="flex-1 block mb-2">{node.name}</Label>
          <Input
            value={formState[node.name]}
            onChange={(e) => handleInputChange(node.name, e.target.value)}
            className="w-full flex-1"
          />
        </div>
      );
    }

    return (
      <Card key={node.name} className="mb-4" style={{ backgroundColor }}>
        <CardHeader>
          <CardTitle>{node.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {node.children?.map((child) => renderNode(child, level + 1))}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div>{renderNode(formStructure)}</div>
      <Button className="w-full" onClick={fetchEHRs}>
        Fetch EHRs
      </Button>
    </div>
  );
}

export default HierarchicalForm;
