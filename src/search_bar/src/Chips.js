import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';
import { HighlightOff } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    padding:'2px',
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

  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  const handleDelete = () => {
    console.info('You clicked the Chip.');
  };

  return (
    <div className={classes.root}>
      <Chip 
      label="Delete" 
      onDelete={handleDelete} 
      />
    </div>
  );
}
/*
<Chip iconColorPrimary="secondary" deleteIcon={<HighlightOff/>} label="Delete" onDelete={handleDelete} color="secondary" />*/