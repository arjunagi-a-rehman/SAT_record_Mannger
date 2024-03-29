import React, { useState } from 'react';
import axios from 'axios';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';  // Add this import

export default function Home() {
  const [content, setContent] = useState('');
  const [activeSection, setActiveSection] = useState(null);
  const [rankResult, setRankResult] = useState(null);
  let rank = null;

  const showContent = (text, section) => {
    setActiveSection(section);
    if (section === 1) {
      setContent(
        <div>
          {renderForm(handleFormSubmit)}
        </div>
      );
    } else if (section === 2) {
      setContent(
        <div>
          {nameFeildForm(rankSubmit)}
        </div>
      );
    } else if (section === 3) {
      fetchSection3Data();
    } else if (section === 4) {
      setContent(
        <div>
          {nameFeildForm(deleteStudent)}
        </div>
      );
    } else {
        setContent(
        <div>
            {updateForm(updateRecord)}
        </div>
        );
    }
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);
      const formDataObject = {};
        formData.forEach((value, key) => {
        formDataObject[key] = value;
        });
        setContent(<p>Loading ...</p>)
      const response = await axios.post('https://sat-y49v.onrender.com/api/student/result', formDataObject);

      if (response.status===201) {


        // Display the result below the form
        setContent(
          <div>
            {renderForm(handleFormSubmit)}
            <div className="alert alert-success">
              Form submitted successfully
            </div>
          </div>
        );
      } else {
        const errorData = await response.json();
        console.error('Error submitting form:', errorData.errorMessage);
        setRankResult('Error submitting form: ' + errorData.errorMessage);

        // Display the error message below the form
        setContent(
          <div>
            
            {renderForm(handleFormSubmit)}
            <p>Error: {errorData.errorMessage}</p>
          </div>
        );
      }
    } catch (error) {
      console.error('Error submitting form:', error.message);
      setRankResult('Error submitting form');
    }
  };

  const updateRecord= async (e) => {
    e.preventDefault();
    try {
        setContent(<p>Loading ...</p>)
        const nameInputValue = e.target.elements.name.value;
        const scoreValue = parseInt(e.target.elements.score.value, 10);
        const response = await axios.patch(`https://sat-y49v.onrender.com/api/student/score/${encodeURIComponent(nameInputValue)}`, null, {
            params: {
              score: encodeURIComponent(scoreValue),
            },
          });
          console.log(response.status)
        if (response.status===204) {
        setContent(
          <div>
          {updateForm(updateRecord)}
            <div className="alert alert-success">
             Marks updated successfully
            </div>
          </div>
        );
        }else{
          const errorData = await response.json();
        console.error('Error fetching rank:', errorData.errorMessage);
        setRankResult('Error fetching rank: ' + errorData.errorMessage);
  
        // Display the error message below the input field
        setContent(
          <div>
            <p>Error: {errorData.errorMessage}</p>
          </div>
        );
        }
  
        
      } catch (error) {
        setContent(
            <div>
            {nameFeildForm(deleteStudent)}
              <div className="alert alert-danger">
               404 No resorce
              </div>
            </div>
          );
        console.error('Error fetching rank:', error.message);
        setRankResult('Error fetching rank');
      }

  }

  const deleteStudent= async (e) => {
    e.preventDefault();
    try {
        setContent(<p>Loading ...</p>)
        const nameInputValue = e.target.elements.name.value;
        const response = await axios.delete(`https://sat-y49v.onrender.com/api/result/student?name=${encodeURIComponent(nameInputValue)}`);
        console.log(response.status)
        if (response.status===200) {
        setContent(
          <div>
          {nameFeildForm(deleteStudent)}
            <div className="alert alert-success">
             deleted successfully
            </div>
          </div>
        );
        }
        else if(response.status===404){
            console.log("here");
            <div className="alert alert-danger">
             no resorce with name ${nameInputValue}
            </div>
        }
        else{
            
          const errorData = await response.json();
          console.log(errorData)
        console.error('Error fetching rank:', errorData.errorMessage);
        setRankResult('Error fetching rank: ' + errorData.errorMessage);
  
        // Display the error message below the input field
        setContent(
          <div>
            <p>Error: {errorData.errorMessage}</p>
          </div>
        );
        }
  
        
      } catch (error) {
        setContent(
            <div>
            {nameFeildForm(deleteStudent)}
              <div className="alert alert-danger">
               404 No resorce
              </div>
            </div>
          );
        console.error('Error fetching rank:', error.message);
        setRankResult('Error fetching rank');
      }

  }

  const rankSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setContent(<p>Loading ...</p>)
      const nameInputValue = e.target.elements.name.value;
      const response = await fetch(`https://sat-y49v.onrender.com/api/student/rank?name=${encodeURIComponent(nameInputValue)}`);

      
      if (response.ok) {
    const data = await response.json();
      rank = data;
      console.log(rank);
      //setRankResult(data);
  
      // Display the result below the input field
      setContent(
        <div>
        {nameFeildForm(rankSubmit)}
          {rank !== null && (
            <div className='alert alert-primary'>
            Rank: {rank}
          </div>
          )}

        </div>
      );
      }else{
        const errorData = await response.json();
      console.error('Error fetching rank:', errorData.errorMessage);
      setRankResult('Error fetching rank: ' + errorData.errorMessage);

      // Display the error message below the input field
      setContent(
        <div>
          <p>Error: {errorData.errorMessage}</p>
        </div>
      );
      }

      
    } catch (error) {
      console.error('Error fetching rank:', error.message);
      setRankResult('Error fetching rank');
    }
  };

  const fetchSection3Data = async () => {
    try {
      setContent(<p>Loading ...</p>)
      const response = await axios.get('https://sat-y49v.onrender.com/api/sat/all');
      setContent(
        <SyntaxHighlighter language="json" style={prism}>
          {JSON.stringify(response.data, null, 2)}
        </SyntaxHighlighter>
      );    } 
      catch (error) {
      console.error('Error fetching data:', error.message);
      setContent('Error fetching data');
    }
  };
  const nameFeildForm = (onSubmit)=>(
    <form onSubmit={onSubmit}>
          <span class="input-group-text" id="inputGroup-sizing-default">Student Name</span>
          <input className='form-control' type="text" name="name" />
          <button className="btn btn-secondary m-1" type="submit">Submit</button>
          </form>
  );
  const updateForm = (onSubmit)=>(
    <form onSubmit={onSubmit}>
          <span class="input-group-text" id="inputGroup-sizing-default">Student Name</span>
          <input className='form-control' type="text" name="name" />
          <span class="input-group-text" id="inputGroup-sizing-default">Score</span>
          <input className='form-control' type="number" name="score" />
          <button className="btn btn-secondary m-1" type="submit">Submit</button>
          </form>
  );
  const renderForm = (onSubmit) => (
<form onSubmit={onSubmit} className='border m-2'>
  <div className="mb-3 row mx-2">
    <div className="col-md-6 form-group">
      <label htmlFor="name" className="form-label">
        Name
      </label>
      <input type="text" className="form-control" id="name" name="name" required />
    </div>
    <div className="col-md-6 form-group" >
      <label htmlFor="score" className="form-label">
        Score (float)
      </label>
      <input type="number" step="0.1" className="form-control" id="score" name="score" required />
    </div>
  </div>
  <div className="mb-3 mx-2">
    <label htmlFor="address" className="form-label">
      Address
    </label>
    <input type="text" className="form-control" id="address" name="address" required />
  </div>
  <div className="mb-3 row mx-2">
    <div className="col-md-4">
      <label htmlFor="pincode" className="form-label">
        Pincode
      </label>
      <input type="text" className="form-control" id="pincode" name="pincode" required />
    </div>
    <div className="col-md-4">
      <label htmlFor="city" className="form-label">
        City
      </label>
      <input type="text" className="form-control" id="city" name="city" required />
    </div>
    <div className="col-md-4">
      <label htmlFor="country" className="form-label">
        Country
      </label>
      <input type="text" className="form-control" id="country" name="country" required />
    </div>
  </div>
  <button className="btn btn-secondary m-1" type="submit">
    Submit
  </button>
</form>

  );

  return (
    <div className="container-fluid m-2 ">
      <div className="container-fluid row justify-content-center ">
        <div
          className={`border col-md-2 btn section1 ${activeSection === 1 ? 'active-section' : ''}`}
          onClick={() => showContent('Hello', 1)}
          style={{ backgroundColor: 'green' }}
        >
          Insert data
        </div>
        <div
          className={`border col-md-2 btn section2 ${activeSection === 2 ? 'active-section' : ''}`}
          onClick={() => showContent('Form', 2)}
          style={{ backgroundColor: 'blue' }}
        >
          Get Rank
        </div>
        <div
          className={`border col-md-2 btn section3 ${activeSection === 3 ? 'active-section' : ''}`}
          onClick={() => showContent('How are you', 3)}
          style={{ backgroundColor: 'white' }}
        >
          View all data
        </div>
        <div
          className={`border col-md-2 btn section4 ${activeSection === 4 ? 'active-section' : ''}`}
          onClick={() => showContent('Bye', 4)}
          style={{ backgroundColor: 'red' }}
        >
          Delete record
        </div>
        <div
          className={`border col-md-2 btn section5 ${activeSection === 5 ? 'active-section' : ''}`}
          onClick={() => showContent('New Section', 5)}
          style={{ backgroundColor: 'orange' }}
        >
          Update score
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-12">
          <div
            id="content"
            className={`text-center ${activeSection === 1 || activeSection === 2 ? 'active-content' : ''}`}
          >
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}