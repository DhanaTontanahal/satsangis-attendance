import React from "react";
import Chip from "@material-ui/core/Chip";

export default function Chips(props) {
  const handleDelete = () => {
    if (props.onDelete) {
      props.onDelete();
    }
  };

  return (
    <div
      style={{
        padding: "2px",
        color: "black",
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        "& > *": {
          margin: "2px",
        },
      }}
    >
      <Chip label={props.label || ""} onDelete={() => handleDelete()} />
    </div>
  );
}
/*
<Chip iconColorPrimary="secondary" deleteIcon={<HighlightOff/>} label="Delete" onDelete={handleDelete} color="secondary" />*/
