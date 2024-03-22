import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { gapi } from 'gapi-script';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const App = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(moment().add(1, 'hour').toDate());

  useEffect(() => {
    gapi.load('client:auth2', () => {
      gapi.client.init({
       apiKey: 'AIzaSyB9lWI3kBLm0OOTYs6PKWpmTf00CemDeuw',
        clientId: '72380184216-1f5oiggbcc6s7ss6sqhfnv2i48qlv4a0.apps.googleusercontent.com',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar.readonly'
      }).then(() => {
        const auth2 = gapi.auth2.getAuthInstance();
        if (!auth2.isSignedIn.get()) {
          auth2.signIn()
            .then(() => fetchEvents())
            .catch(error => console.error('Error signing in:', error));
        } else {
          fetchEvents();
        }
      }).catch(error => console.error('Error initializing Google API client:', error));
    });
  }, []);

  const fetchEvents = () => {
    gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 1000,
      orderBy: 'startTime'
    }).then(response => {
      const formattedEvents = response.result.items.map(event => ({
        id: event.id,
        title: "bussy",
        start: new Date(event.start.dateTime || event.start.date),
        end: new Date(event.end.dateTime || event.end.date)
      }));
      setEvents(formattedEvents);
      setLoading(false);
    }).catch(error => console.error('Error fetching events:', error));
  };
  const handleCreateEvent = () => {
    const event = {
      'summary': eventName,
      'description': eventDescription,
      'start': {
        'dateTime': moment(startDate).toISOString(),
        'timeZone':Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'end': {
        'dateTime': moment(endDate).toISOString(),
        'timeZone':Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };

    gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': event
    }).then(response => {
      console.log('Event created:', response.result);
      fetchEvents(); // Refresh events after creating the new event
      // Reset fields after creating the event
      setEventName('');
      setEventDescription('');
      setStartDate(new Date());
      setEndDate(moment().add(1, 'hour').toDate());
    }).catch(error => console.error('Error creating event:', error));
  };



  return (
    <div>
       <h1>Google Calendar Events</h1>
      <div>
        <label>Event Name:</label>
        <input type="text" value={eventName} onChange={e => setEventName(e.target.value)} />
      </div>
      <div>
        <label>Event Description:</label>
        <input type="text" value={eventDescription} onChange={e => setEventDescription(e.target.value)} />
      </div>
      <div>
        <label>Start Date:</label>
        <input type="datetime-local" value={moment(startDate).format('YYYY-MM-DDTHH:mm')} onChange={e => setStartDate(new Date(e.target.value))} />
      </div>
      <div>
        <label>End Date:</label>
        <input type="datetime-local" value={moment(endDate).format('YYYY-MM-DDTHH:mm')} onChange={e => setEndDate(new Date(e.target.value))} />
      </div>
      <button onClick={handleCreateEvent}>Create Event</button>
      <br />

      <h1>Calendar Events</h1>
<br></br>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      )}
    </div>
  );
};

export default App;