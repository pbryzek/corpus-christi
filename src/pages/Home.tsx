import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import Worship from '../components/Worship';
import Welcome from '../components/Welcome';
import Difference from '../components/Difference';
import Deepen from '../components/Deepen';
import Sacraments from '../components/Sacraments';
import Give from '../components/Give';
import PrayerRequests from '../components/PrayerRequests';
import { supabase } from '../lib/supabase';
import { usePageData } from '../lib/usePageData';

export interface HomeAnnouncement {
  id: string;
  title: string;
  body: string;
  link_url: string | null;
  link_label: string | null;
  video_url: string | null;
  image_url: string | null;
}

export default function Home() {
  const [events, setEvents] = useState<{
    id: string; title: string; description: string | null;
    event_date: string; end_time: string | null; event_type: string;
    recurrence: string | null; event_url: string | null; flyer_url: string | null; time_tbd: boolean | null;
    location: string | null; contact_email: string | null; show_on_home: boolean;
  }[]>([]);
  const [announcements, setAnnouncements] = useState<HomeAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const { content } = usePageData('homepage');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [eventsRes, announcementsRes] = await Promise.all([
          supabase.from('events').select('*').order('event_date', { ascending: true }),
          supabase
            .from('announcements')
            .select('id, title, body, link_url, link_label, video_url, image_url')
            .eq('show_on_home', true)
            .order('sort_order', { ascending: true })
            .order('created_at', { ascending: false }),
        ]);
        if (!eventsRes.error) setEvents(eventsRes.data || []);
        if (!announcementsRes.error) setAnnouncements(announcementsRes.data || []);
      } catch {
        // Network unavailable — show page without dynamic data
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <>
      <Hero cmsContent={content['hero']} />
      <Worship events={events} announcements={announcements} loading={loading} />
      <Difference cmsContent={content['difference']} />
      <Welcome cmsContent={content['welcome']} />
      <Deepen cmsContent={content['deepen']} />
      <Sacraments />
      <Give cmsContent={content['give']} />
      <PrayerRequests />
    </>
  );
}
