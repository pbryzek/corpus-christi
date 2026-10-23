import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export interface PagePhoto {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  is_featured: boolean;
}

export interface PageContent {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  body_text: string | null;
  image_url: string | null;
  link_url: string | null;
  link_label: string | null;
}

export interface PageContact {
  id: string;
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  image_url: string | null;
  sort_order: number;
}

export interface PageEvent {
  id: string;
  emoji: string | null;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  rsvp_open: boolean;
  rsvp_url: string | null;
  sort_order: number;
  button_label: string | null;
  contact_email: string | null;
}

interface PageData {
  photos: PagePhoto[];
  content: Record<string, PageContent>;
  contacts: PageContact[];
  events: PageEvent[];
  loading: boolean;
}

export function usePageData(slug: string): PageData {
  const [photos, setPhotos] = useState<PagePhoto[]>([]);
  const [content, setContent] = useState<Record<string, PageContent>>({});
  const [contacts, setContacts] = useState<PageContact[]>([]);
  const [events, setEvents] = useState<PageEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [photosRes, contentRes, contactsRes, eventsRes] = await Promise.all([
        supabase.from('page_photos').select('*').eq('page_slug', slug).order('sort_order'),
        supabase.from('page_content').select('*').eq('page_slug', slug),
        supabase.from('page_contacts').select('*').eq('page_slug', slug).order('sort_order'),
        supabase.from('page_events').select('*').eq('page_slug', slug).order('sort_order'),
      ]);

      if (photosRes.data) setPhotos(photosRes.data);
      if (contentRes.data) {
        const map: Record<string, PageContent> = {};
        contentRes.data.forEach(row => { map[row.section_key] = row; });
        setContent(map);
      }
      if (contactsRes.data) setContacts(contactsRes.data);
      if (eventsRes.data) setEvents(eventsRes.data);
      setLoading(false);
    }
    load();
  }, [slug]);

  return { photos, content, contacts, events, loading };
}
