import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

interface types {
    label:string
    onClick?: () => void
} 

export default function ButtonSizes(props: types) {
  return (
        <div>
            <Button 
            variant="contained"
            type='submit'
            onClick={props.onClick}
             sx={{
                padding: '10px 24px',
                fontSize: '1.1rem',     
                width: '420px',         
              }}
            >
                {props.label}
            </Button>
        </div>
  );
}
