import React, { useState } from 'react';
import Modal from 'src/components/Modal';
import { Radio } from 'antd';
// import { styled } from '@superset-ui/core';

// const TextArea = styled.textarea`
//   width: 100%;
//   padding: 10px;
// `;

// const Label = styled.label`
//   width: 100%;
// `;

const options = [
  { label: 'True Positive', value: 'True Positive' },
  { label: 'False Positive', value: 'False Positive' },
];

interface MessageModalProps {
  hide: () => void;
  isOpen: boolean;
  submit: (msg: string) => void;
  primaryId?: string;
}

export default function MessageModal(props: MessageModalProps) {
  const { hide, isOpen, submit, primaryId } = props;
  const [value, setValue] = useState('');

  const onHide = () => {
    hide();
    setValue('');
  };

  const onSubmit = () => {
    submit(value);
    setValue('');
  };

  return (
    <Modal
      onHide={onHide}
      onHandledPrimaryAction={onSubmit}
      primaryButtonName="Send"
      show={isOpen}
      title="Message"
    >
      {/* <Label htmlFor="message">Message</Label>
      <TextArea
        value={message}
        onChange={e => setMessage(e.target.value)}
        id="message"
      /> */}
      {/* <select value={value} onChange={e => setValue(e.target.value)}>
        <option value="True Positive">True Positive</option>
        <option value="False Positive">False Positive</option>
      </select> */}
      <div>
        <h3 style={{ marginTop: '10px' }}>Select appropriate option</h3>
        <Radio.Group
          options={options}
          onChange={e => setValue(e.target.value)}
          value={value}
        />
      </div>
      <p style={{ marginTop: '30px', color: 'gray' }}>
        Primary key selected: <b>{primaryId || 'Not selected'}</b>
      </p>
    </Modal>
  );
}
