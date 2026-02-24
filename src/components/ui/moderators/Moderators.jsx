import { useRef } from 'react';
import ModeratorsTable from './ModeratorsTable';
import '../donors/donors.css';

const addSvg = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Moderators = () => {
  const tableRef = useRef(null);

  return (
    <div className="mt-2 mx-4">
      <div className="page-title-row">
        <h1>Moderators</h1>
        <button className="btn-add-round" onClick={() => tableRef.current?.handleAdd()}>
          {addSvg}
        </button>
      </div>
      <ModeratorsTable ref={tableRef} />
      <button className="fab-add" onClick={() => tableRef.current?.handleAdd()}>
        {addSvg}
      </button>
    </div>
  );
};

export default Moderators;
