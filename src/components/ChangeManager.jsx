import React, { useEffect, useState } from 'react';
import { SelectDialog, StandardListItem } from '@ui5/webcomponents-react';
import api from '../utils/api';

function ChangeManager(props) {
  const [manager, setManager] = useState([]);

  useEffect(() => {
    getUserList();
  async function getUserList() {
    const result = await api.getUserList('com4in');
    if(result) {
      setManager(Array.from(result));
    };
  };
  }, []);

  return (
    <SelectDialog
      headerText='담당자 배정'
      open={props.show === true}
      onAfterClose={() => props.close()}
      onConfirm={(e) => props.manager(e)}
    >
    {manager.map((index, item) => 
      <StandardListItem key={item} description={index.name}>
        {index.email}
      </StandardListItem>
    )}
    </SelectDialog>
  );
};

export default ChangeManager;