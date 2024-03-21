import './App.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useSession,useSupabaseClient,useSessionContext } from '@supabase/auth-helpers-react';
import DateTimePicker from 'react-datetime-picker';
import React, { useState, useEffect } from 'react';

function App() {

  const localizer = momentLocalizer(moment);
  const [events, setEvents] = useState([]); // State to manage calendar events

  const session = useSession();
  const supabase = useSupabaseClient();
  const { isLoading } = useSessionContext();
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date()); 
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const formatDateTime = (date) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    };
    return new Intl.DateTimeFormat(navigator.language, options).format(date);
  };

  useEffect(() => {
     // Fetch events from Google Calendar API
      fetchGoogleCalendarEvents();
    
  });

    
   
  async function fetchGoogleCalendarEvents() {
    const access_Token = 'ya29.a0Ad52N38kdK13QJKzW_33njC6yuvv3InVERnVtQkInC07ILFhSJWFcANloOqiSRRjK-21X0i-LdmIjQpL_c3Mnsswrx8V74N18rBnuDYV6my3bK5-9RgDVGOlGKbmbF0ryKUPW0QBul74GqLIZQ64QHi6-ji25TO4d-QaCgYKAWoSARESFQHGX2MiolryyRXry1gnGvj0fIG_eg0170'
    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_Token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch calendar events');
      }

      const data = await response.json();
      const fetchedEvents = data.items.map(item => ({
        title: "Busy",
        start: new Date(item.start.dateTime),
        end: new Date(item.end.dateTime),
      }));

      setEvents(fetchedEvents);
    } catch (error) {
      console.error(error);
    }
  }


  async function googleSignIn(){
   const{ error}= await supabase.auth.signInWithOAuth({
      provider:'google',
      options:{
        scopes:'https://www.googleapis.com/auth/calendar'
      }
    });
    if(error){
      alert("Error loging to google")
    }
  }
async function createCalenderEvent(){
  const access_Token = 'ya29.a0Ad52N38kdK13QJKzW_33njC6yuvv3InVERnVtQkInC07ILFhSJWFcANloOqiSRRjK-21X0i-LdmIjQpL_c3Mnsswrx8V74N18rBnuDYV6my3bK5-9RgDVGOlGKbmbF0ryKUPW0QBul74GqLIZQ64QHi6-ji25TO4d-QaCgYKAWoSARESFQHGX2MiolryyRXry1gnGvj0fIG_eg0170'

  console.log("create calender event")
  const newEvent = {
    title: "busy",
    start,
    end,
  };
  setEvents([...events, newEvent]); // Update events state

  const event = {
    'summary': eventName,
    'description': eventDescription,
    'start': {
      'dateTime': start.toISOString(),
      'timeZone':Intl.DateTimeFormat().resolvedOptions().timeZone

    },
    'end': {
      'dateTime': end.toISOString(),
      'timeZone':Intl.DateTimeFormat().resolvedOptions().timeZone

    }

  }
  try {
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_Token}`
      },
      body: JSON.stringify(event)
    });

    if (!response.ok) {
      throw new Error('Failed to create calendar event');
    }

    const data = await response.json();
    console.log(data);
    alert('Event created successfully');
  } catch (error) {
    console.error(error);
    alert('Error creating calendar event');
  }
  setEventName("");
  setEventDescription("");
  setStart(new Date());
  setEnd(new Date());


}
  async function Signout(){
    await supabase.auth.signOut();
  }
  console.log(start);
  console.log(end);
  
  return (
    <div className="App">
      <div style={{width:"400px",margin:"30px auto"}}>
       
     <Calendar
              localizer={localizer}
              events={events} // Pass the events array to the Calendar component
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
            />

            <p>Start of your event</p>
            <DateTimePicker onChange={setStart} value={start} />
            <p>Start: {formatDateTime(start)}</p>

            <p>End of your event</p>
            <DateTimePicker onChange={setEnd} value={end} />
            <p>Start: {formatDateTime(end)}</p>

            <p>Event name</p>
            <input type = "text" onChange={(e)=> setEventName(e.target.value)} />
            <p>Event Description</p>
            <input type = "text" onChange={(e)=> setEventDescription(e.target.value)} />
            <button onClick={()=> createCalenderEvent()}>create event </button>



     
      </div>
    </div>
  );
}

export default App;
