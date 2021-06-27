import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px',
    color: 'black',
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

export default function Chips(props) {
  const classes = useStyles();

  const handleDelete = () => {
    if (props.onDelete) {
      props.onDelete();
    }
  };

  return (
    <div className={classes.root}>
      <Chip label={props.label || ''} onDelete={() => handleDelete()} />
    </div>
  );
}
/*
<Chip iconColorPrimary="secondary" deleteIcon={<HighlightOff/>} label="Delete" onDelete={handleDelete} color="secondary" />*/
