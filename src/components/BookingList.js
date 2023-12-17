import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const BookingList = ({ bookings }) => {
    return (
        <div>
            <h2>Booking List</h2>
            <DataTable value={bookings}>
                <Column field="booking_id" header="Booking ID"></Column>
                <Column field="booked_by" header="Booked By"></Column>
                <Column field="choose_test" header="Choose Test"></Column>
                <Column field="booking_date" header="Booking Date"></Column>
                <Column field="choose_lab" header="Choose Lab"></Column>
                <Column field="choose_slot" header="Choose Slot"></Column>
                <Column field="total_price" header="Total Price"></Column>
                <Column field="p_id" header="Patient ID"></Column>
            </DataTable>
        </div>
    );
};

export default BookingList;
