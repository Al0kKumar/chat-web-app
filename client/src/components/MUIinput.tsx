import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

interface propstype{
 label: string
 type: string
 value: string
 onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function FullWidthTextField(props: propstype) {
  return (
    <Box sx={{ width: 500, maxWidth: '100%' }}>
      <TextField 
      fullWidth
      label={props.label} 
      type={props.type}
      value={props.value}
      onChange={props.onChange}
      />
    </Box>
  );
}

// id="fullWidth"