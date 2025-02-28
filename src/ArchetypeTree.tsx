import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

type NodeValue =
  | {
      lower?: string | number;
      upper?: string | number;
    }
  | string
  | number
  | boolean;

type Node = {
  name: string;
  children?: Node[];
  inputType?: string;
  value?: NodeValue;
  fixedValue?: string;
};

type TreeNodeProps = {
  node: Node;
  depth?: number;
  formState: Record<string, any>;
  onInputChange: (key: string, value: any) => void;
  path?: string[];
};

function formatDateForInput(timestamp: number) {
  return new Date(timestamp).toISOString().split("T")[0];
}

export default function ArchetypeTree({
  data,
  onChange,
}: {
  data: Node;
  onChange?: (values: Record<string, any>) => void;
}) {
  const [formState, setFormState] = useState({
    "issue date-start": undefined,
    "issue date-end": undefined,
    "healthcare unit": "",
    State: "",
    "patient age-start": "",
    "patient age-end": "",
    "duration of treatment-start": "",
    "duration of treatment-end": "",
    schema: "",
    "date of beginning of chemotherapy-start": undefined,
    "date of beginning of chemotherapy-end": undefined,
    "date of discharge-start": undefined,
    "date of discharge-end": undefined,
    "reason for discharge": "",
    Problem: "",
    "Secondary Diagnosis": "",
    "Associated Causes": "",
    "Invaded regional linphonodes": "",
    "Clinical Staging": "",
    "Histopathological grading (G)": "",
    "date of pathological identification-start": undefined,
    "date of pathological identification-end": undefined,
    topography: "",
    Procedure: "",
  });

  const handleInputChange = (key: string, value: any) => {
    setFormState((prev) => {
      const newState = {
        ...prev,
        [key]: value,
      };
      onChange?.(newState);
      return newState;
    });
    console.log("====================================");
    console.log(formState);
    console.log("====================================");
  };

  return (
    <div className="ml-4 min-h-screen">
      <TreeNode
        node={data}
        formState={formState}
        onInputChange={handleInputChange}
        path={[]}
      />
    </div>
  );
}

function TreeNode({
  node,
  depth = 0,
  formState,
  onInputChange,
  path = [],
}: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const nodePath = [...path, node.name];

  const handleNodeClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const renderInput = () => {
    const inputType = node.inputType || "text";
    const nodeName = node.name.toLowerCase();

    if (node?.fixedValue) {
      return (
        <input
          type={inputType}
          className="ml-4 px-2 py-1 border rounded text-sm"
          value={node.fixedValue}
          disabled
        />
      );
    }

    switch (inputType) {
      case "date": {
        const startKey = `${nodeName}-start`;
        const endKey = `${nodeName}-end`;

        return (
          <div className="ml-4 flex items-center space-x-2">
            <input
              type="date"
              placeholder="Start Date"
              className="px-2 py-1 border rounded text-sm"
              value={formState[startKey] || ""}
              onChange={(e) => onInputChange(startKey, e.target.value)}
            />
            <span>-</span>
            <input
              type="date"
              placeholder="End Date"
              className="px-2 py-1 border rounded text-sm"
              value={formState[endKey] || ""}
              onChange={(e) => onInputChange(endKey, e.target.value)}
            />
          </div>
        );
      }

      case "range": {
        const startKey = `${nodeName}-start`;
        const endKey = `${nodeName}-end`;

        return (
          <div className="ml-4 flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min"
              className="px-2 py-1 border rounded text-sm w-24"
              value={formState[startKey] || ""}
              onChange={(e) => onInputChange(startKey, e.target.value)}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              className="px-2 py-1 border rounded text-sm w-24"
              value={formState[endKey] || ""}
              onChange={(e) => onInputChange(endKey, e.target.value)}
            />
          </div>
        );
      }

      case "number":
        return (
          <input
            type="number"
            className="ml-4 px-2 py-1 border rounded text-sm w-24"
            value={formState[nodeName] || ""}
            onChange={(e) => onInputChange(nodeName, e.target.value)}
          />
        );

      case "boolean":
        return (
          <input
            type="checkbox"
            className="ml-4"
            checked={!!formState[nodeName]}
            onChange={(e) => onInputChange(nodeName, e.target.checked)}
          />
        );

      case "text":
      default:
        return (
          <input
            type="text"
            className="ml-4 px-2 py-1 border rounded text-sm"
            value={formState[nodeName] || ""}
            onChange={(e) => onInputChange(nodeName, e.target.value)}
            placeholder="Enter value"
          />
        );
    }
  };

  return (
    <div className="ml-4 w-fit">
      <div
        className={`
          flex items-center 
          ${hasChildren ? "cursor-pointer hover:bg-blue-200" : ""}
          hover:bg-gray-200 
          focus:bg-gray-200
          p-2 rounded 
        `}
        style={{ paddingLeft: `${depth * 16}px` }}
        onClick={hasChildren ? handleNodeClick : undefined}
      >
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )
        ) : (
          <div className="w-4 h-4 inline-block" />
        )}

        <span className={`ml-2 ${hasChildren ? "font-semibold" : ""}`}>
          {node.name}
        </span>

        {!hasChildren && renderInput()}
      </div>

      {hasChildren && isExpanded && (
        <div className="border-l-2 border-gray-300">
          {node.children?.map((childNode, index) => (
            <TreeNode
              key={`${childNode.name}-${index}`}
              node={childNode}
              depth={depth + 1}
              formState={formState}
              onInputChange={onInputChange}
              path={nodePath}
            />
          ))}
        </div>
      )}
    </div>
  );
}
