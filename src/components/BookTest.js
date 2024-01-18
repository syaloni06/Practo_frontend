import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import Swal from 'sweetalert2';
import BookingList from './BookingList';

const BookTest = ({ userInfo }) => {
  const [tests, setTests] = useState([{ testName: '', slotName: '', date: null, lab: '' }]);
  const [slots, setSlots] = useState(null);
  const [bookingList, setBookingList] = useState(null);
  const [labs, setLabs] = useState(null);
  const [diagnosticTest, setdiagnosticTest] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  // console.log(tests);
  // console.log(user.user_id);
  useEffect(() => {
    // Function to fetch slots
    const fetchSlots = async () => {
      try {
        // Perform the API call to fetch slots
        const response = await fetch('http://localhost:8080/api/slot/show');

        // Check if the response is successful (status code 200)
        if (response.ok) {
          // Parse the response data as JSON
          const data = await response.json();

          // Update the state with the fetched slots
          setSlots(data);
          //console.log(data);
        } else {
          // Handle errors if the response status is not OK
          console.error('Failed to fetch slots. Status:', response.status);
        }
      } catch (error) {
        // Handle any other errors that might occur during the fetch
        console.error('Error fetching slots:', error.message);
      }
    };

    const fetchBookings = async () => {
      try {
        // Perform the API call to fetch slots
        const response = await fetch('http://localhost:8080/api/booking/find');

        // Check if the response is successful (status code 200)
        if (response.ok) {
          // Parse the response data as JSON
          let data = await response.json();

          // Update the state with the fetched slots
          const dataBooking = data.map((booking) => {
            // Add an extra field to each booking

            // Convert the input date string to a Date object
            const inputDate = new Date(booking.booking_date);

            // Get today's date
            const todayDate = new Date();

            // Compare the dates
            if (inputDate < todayDate) {
              const newBooking = {
                ...booking,  // Copy existing fields
                status: 'Expired',  // Add the new field with a desired value
              };
              return newBooking;
            } else if (inputDate.toDateString() === todayDate.toDateString()) {
              const newBooking = {
                ...booking,  // Copy existing fields
                status: 'Ongoing',  // Add the new field with a desired value
              };
              return newBooking;
            } else {
              const newBooking = {
                ...booking,  // Copy existing fields
                status: 'Upcoming',  // Add the new field with a desired value
              };
              return newBooking;
            }
          });

          // Now dataBooking contains the modified array with the extra field

          setBookingList(dataBooking);
          //console.log(data);
        } else {
          // Handle errors if the response status is not OK
          console.error('Failed to fetch slots. Status:', response.status);
        }
      } catch (error) {
        // Handle any other errors that might occur during the fetch
        console.error('Error fetching slots:', error.message);
      }
    };

    const fetchLabs = async () => {
      try {
        // Perform the API call to fetch slots
        const response = await fetch('http://localhost:8080/api/lab/show');

        // Check if the response is successful (status code 200)
        if (response.ok) {
          // Parse the response data as JSON
          const data = await response.json();

          // Update the state with the fetched slots
          setLabs(data);
          //console.log(data);
        } else {
          // Handle errors if the response status is not OK
          console.error('Failed to fetch slots. Status:', response.status);
        }
      } catch (error) {
        // Handle any other errors that might occur during the fetch
        console.error('Error fetching slots:', error.message);
      }
    };

    const fetchTests = async () => {
      try {
        // Perform the API call to fetch slots
        const response = await fetch('http://localhost:8080/api/diagnosticTest/show');

        // Check if the response is successful (status code 200)
        if (response.ok) {
          // Parse the response data as JSON
          const data = await response.json();

          // Update the state with the fetched slots
          setdiagnosticTest(data);
          //console.log(data);
        } else {
          // Handle errors if the response status is not OK
          console.error('Failed to fetch slots. Status:', response.status);
        }
      } catch (error) {
        // Handle any other errors that might occur during the fetch
        console.error('Error fetching slots:', error.message);
      }
    };

    // Call the fetchSlots function when the component mounts
    fetchSlots();
    fetchLabs();
    fetchTests();
    fetchBookings();
  }, []); // The empty dependency array ensures that this effect runs only once when the component mounts


  const handleSubmit = async () => {
    Swal.fire({
      title: 'Uploading...',
      html: 'Please wait...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    });
    let p_id;

    const uploadPrescription = async () => {
      try {
        const formData = new FormData();
        formData.append('file', uploadedFile);

        const response = await fetch('http://localhost:8080/api/prescription/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          await response.text().then(data => {
            p_id = JSON.parse(data).prescription_id;
          })
        } else {
          console.error('Failed to upload prescription. Status:', response.status);
        }
      } catch (error) {
        console.error('Error uploading prescription:', error.message);
      }
    };

    const bookTest = async () => {
      try {
        // Use Promise.all to wait for all promises to resolve
        const bookingPromises = tests.map(async (test, index) => {
          let formattedDate = test.date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });

          return {
            "choose_test": test.testName,
            "choose_slot": test.slotName,
            "booking_date": formattedDate,
            "choose_lab": test.lab,
            "p_id": p_id
          };
        });

        // Wait for all promises to resolve
        const booking = await Promise.all(bookingPromises);

        console.log(booking);
        let user = {
          "user_id": userInfo.user_id,
          "booking": booking
        }

        const response = await fetch('http://localhost:8080/api/diagnosticTest/booking_test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });

        if (response.ok) {
          setTests([{ testName: '', slotName: '', date: null, lab: '' }]);
          setUploadedFile(null);
          console.log('Book test successful');
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Your Booking is Successful",
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          console.error('Failed to book test. Status:', response.status);
        }
        console.log(user);
      } catch (error) {
        console.error('Error booking test:', error.message);
      }
    };


    await uploadPrescription();
    await bookTest();
  };



  const handleAddTest = () => {
    setTests([...tests, { testName: '', slotName: '', date: null, lab: '' }]);
  };

  const handleDeleteTest = (index) => {
    const newTests = [...tests];
    newTests.splice(index, 1);
    setTests(newTests);
  };

  const handleInputChange = (index, field, value) => {
    const newTests = [...tests];
    newTests[index][field] = value;
    setTests(newTests);
  };

  const handleFileUpload = (event) => {
    const file = event.files[0];
    setUploadedFile(file);
  };

  const slotOptions = slots?.map((slot) => ({
    label: slot.slot_name,
    value: slot.slot_name,
  }));

  const testNameOptions = diagnosticTest?.map((test) => ({
    label: test.test_name,
    value: test.test_name,
  }));

  const labOptions = labs?.map((lab) => ({
    label: lab.lab_name,
    value: lab.lab_name,
  }));


  return (
    <>
      {userInfo?.user_type === "user" ? (
        <>
          <div style={{ padding: '20px', overflowY: 'auto', maxHeight: '600px' }}>
            <Card title="Book Your Diagnostic Tests" style={{ display: "flex", justifyContent: "center", width: '600px', margin: '20px auto' }}>
              <h1>Test List</h1>
              <div>
                <label>Upload Prescription:</label>
                <input
                  type="file"
                  accept=".jpg, .jpeg, .png, .pdf"
                  onChange={(e) => handleFileUpload(e.target)}
                />
              </div>
              <br></br>
              {tests.map((test, index) => (
                <div key={index} className="p-field">
                  <div>
                    <div>
                      <label>Test Name:</label>&nbsp;
                      <Dropdown
                        options={testNameOptions}
                        value={test.testName}
                        onChange={(e) => handleInputChange(index, 'testName', e.value)}
                        placeholder="Select Test"
                      />
                      &nbsp;&nbsp;&nbsp;
                      <label>Slot Name:</label>&nbsp;
                      <Dropdown
                        style={{ maxWidth: "200px" }}
                        options={slotOptions}
                        value={test.slotName}
                        onChange={(e) => handleInputChange(index, 'slotName', e.value)}
                        placeholder="Select Slot"
                      />
                    </div>
                    <br></br>
                    <div>

                      <label>Select Date:</label>&nbsp;
                      <Calendar
                        style={{ width: "140px" }}
                        value={test.date}
                        onChange={(e) => handleInputChange(index, 'date', e.value)}
                        showIcon
                      />

                      &nbsp;&nbsp;&nbsp;

                      <label>Choose Lab:</label>&nbsp;
                      <Dropdown
                        options={labOptions}
                        value={test.lab}
                        onChange={(e) => handleInputChange(index, 'lab', e.value)}
                        placeholder="Select Lab"
                      />

                    </div>
                  </div>

                  <div style={{ margin: "10px 0px 10px 0px", display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      label="Delete"
                      icon="pi pi-trash"
                      className="p-button-danger"
                      onClick={() => handleDeleteTest(index)}
                    />
                  </div>
                </div>
              ))}
              <br></br>
              <Button label="Add Test" onClick={handleAddTest} /> &nbsp;&nbsp;
              <Button severity="success" label="Submit" onClick={handleSubmit} />
              <br></br>

            </Card>
          </div>
        </>
      ) : (
        <>
          <BookingList bookings={bookingList}></BookingList>
        </>
      )}
    </>
  );
};

export default BookTest;
