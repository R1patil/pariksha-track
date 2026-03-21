export interface Chapter {
  id: string;
  title: string;
  type: "prose" | "poem" | "supplementary" | "grammar";
  kseebUrl: string;
}

export interface SubjectData {
  id: string;
  title: string;
  color: string;
  chapters: Chapter[];
}

export const englishChapters: Record<string, SubjectData> = {
  "8": {
    id: "english_8",
    title: "English — 8th Standard",
    color: "#6366f1",
    chapters: [
      // Prose
      { id:"8e_p1",  title:"The Best Christmas Present in the World",  type:"prose",  kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-for-class-8-english-chapter-1/" },
      { id:"8e_p2",  title:"The Tsunami",                               type:"prose",  kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-for-class-8-english-chapter-2/" },
      { id:"8e_p3",  title:"Glimpses of the Past",                      type:"prose",  kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-for-class-8-english-chapter-3/" },
      { id:"8e_p4",  title:"Bepin Choudhury's Lapse of Memory",         type:"prose",  kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-for-class-8-english-chapter-4/" },
      { id:"8e_p5",  title:"The Summit Within",                         type:"prose",  kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-for-class-8-english-chapter-5/" },
      { id:"8e_p6",  title:"This is Jody's Fawn",                       type:"prose",  kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-for-class-8-english-chapter-6/" },
      { id:"8e_p7",  title:"A Visit to Cambridge",                      type:"prose",  kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-for-class-8-english-chapter-7/" },
      { id:"8e_p8",  title:"A Short Monsoon Diary",                     type:"prose",  kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-for-class-8-english-chapter-8/" },
      // Poems
      { id:"8e_po1", title:"The Ant and the Cricket (Poem)",            type:"poem",   kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-for-class-8-english-poem-chapter-1/" },
      { id:"8e_po2", title:"Geography Lesson (Poem)",                   type:"poem",   kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-for-class-8-english-poem-chapter-2/" },
      { id:"8e_po3", title:"Macavity: The Mystery Cat (Poem)",          type:"poem",   kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-for-class-8-english-poem-chapter-3/" },
      { id:"8e_po4", title:"The Last Bargain (Poem)",                   type:"poem",   kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-for-class-8-english-poem-chapter-4/" },
      { id:"8e_po5", title:"The School Boy (Poem)",                     type:"poem",   kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-for-class-8-english-poem-chapter-5/" },
      { id:"8e_po6", title:"The Duck and the Kangaroo (Poem)",          type:"poem",   kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-for-class-8-english-poem-chapter-6/" },
      { id:"8e_po7", title:"When I Set Out for Lyonnesse (Poem)",       type:"poem",   kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-for-class-8-english-poem-chapter-7/" },
      { id:"8e_po8", title:"On the Grasshopper and Cricket (Poem)",     type:"poem",   kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-for-class-8-english-poem-chapter-8/" },
    ],
  },
  "9": {
    id: "english_9",
    title: "English — 9th Standard",
    color: "#10b981",
    chapters: [
      // Prose
      { id:"9e_p1",  title:"The Fun They Had",                          type:"prose",  kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-class-9-english-prose-chapter-1/" },
      { id:"9e_p2",  title:"The Sound of Music",                        type:"prose",  kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-class-9-english-prose-chapter-2/" },
      { id:"9e_p3",  title:"The Little Girl",                           type:"prose",  kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-class-9-english-prose-chapter-3/" },
      { id:"9e_p4",  title:"A Truly Beautiful Mind",                    type:"prose",  kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-class-9-english-prose-chapter-4/" },
      { id:"9e_p5",  title:"The Snake and the Mirror",                  type:"prose",  kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-class-9-english-prose-chapter-5/" },
      { id:"9e_p6",  title:"My Childhood",                              type:"prose",  kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-class-9-english-prose-chapter-6/" },
      { id:"9e_p7",  title:"Packing",                                   type:"prose",  kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-class-9-english-prose-chapter-7/" },
      { id:"9e_p8",  title:"Reach for the Top",                         type:"prose",  kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-class-9-english-prose-chapter-8/" },
      // Poems
      { id:"9e_po1", title:"The Road Not Taken (Poem)",                 type:"poem",   kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-class-9-english-poem-chapter-1/" },
      { id:"9e_po2", title:"Wind (Poem)",                               type:"poem",   kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-class-9-english-poem-chapter-2/" },
      { id:"9e_po3", title:"Rain on the Roof (Poem)",                   type:"poem",   kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-class-9-english-poem-chapter-3/" },
      { id:"9e_po4", title:"The Lake Isle of Innisfree (Poem)",         type:"poem",   kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-class-9-english-poem-chapter-4/" },
      { id:"9e_po5", title:"A Legend of the Northland (Poem)",          type:"poem",   kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-class-9-english-poem-chapter-5/" },
      { id:"9e_po6", title:"No Men Are Foreign (Poem)",                 type:"poem",   kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-class-9-english-poem-chapter-6/" },
      { id:"9e_po7", title:"On Killing a Tree (Poem)",                  type:"poem",   kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-class-9-english-poem-chapter-7/" },
      { id:"9e_po8", title:"The Snake Trying (Poem)",                   type:"poem",   kseebUrl:"https://www.kseebsolutions.com/kseeb-solutions-class-9-english-poem-chapter-8/" },
    ],
  },
  "10": {
    id: "english_10",
    title: "English — 10th Standard (SSLC)",
    color: "#f59e0b",
    chapters: [
      // Prose
      { id:"10e_p1",  title:"A Hero",                                   type:"prose",  kseebUrl:"https://www.kseebsolutions.com/kseeb-sslc-class-10-english-solutions-prose-chapter-1/" },
      { id:"10e_p2",  title:"There's a Girl by the Tracks!",            type:"prose",  kseebUrl:"https://www.kseebsolutions.com/kseeb-sslc-class-10-english-solutions-prose-chapter-2/" },
      { id:"10e_p3",  title:"Gentleman of Rio en Medio",                type:"prose",  kseebUrl:"https://www.kseebsolutions.com/kseeb-sslc-class-10-english-solutions-prose-chapter-3/" },
      { id:"10e_p4",  title:"Dr. B.R. Ambedkar",                        type:"prose",  kseebUrl:"https://www.kseebsolutions.com/kseeb-sslc-class-10-english-solutions-prose-chapter-4/" },
      { id:"10e_p5",  title:"The Concert",                              type:"prose",  kseebUrl:"https://www.kseebsolutions.com/kseeb-sslc-class-10-english-solutions-prose-chapter-5/" },
      { id:"10e_p6",  title:"The Discovery",                            type:"prose",  kseebUrl:"https://www.kseebsolutions.com/kseeb-sslc-class-10-english-solutions-prose-chapter-6/" },
      { id:"10e_p7",  title:"Colours of Silence",                       type:"prose",  kseebUrl:"https://www.kseebsolutions.com/kseeb-sslc-class-10-english-solutions-prose-chapter-7/" },
      { id:"10e_p8",  title:"Science and Hope of Survival",             type:"prose",  kseebUrl:"https://www.kseebsolutions.com/kseeb-sslc-class-10-english-solutions-prose-chapter-8/" },
      // Poems
      { id:"10e_po1", title:"Grandma Climbs a Tree (Poem)",             type:"poem",   kseebUrl:"https://www.kseebsolutions.com/kseeb-sslc-class-10-english-solutions-poetry-chapter-1/" },
      { id:"10e_po2", title:"Quality of Mercy (Poem)",                  type:"poem",   kseebUrl:"https://www.kseebsolutions.com/kseeb-sslc-class-10-english-solutions-poetry-chapter-2/" },
      { id:"10e_po3", title:"I am the Land (Poem)",                     type:"poem",   kseebUrl:"https://www.kseebsolutions.com/kseeb-sslc-class-10-english-solutions-poetry-chapter-3/" },
      { id:"10e_po4", title:"The Song of India (Poem)",                 type:"poem",   kseebUrl:"https://www.kseebsolutions.com/kseeb-sslc-class-10-english-solutions-poetry-chapter-4/" },
      { id:"10e_po5", title:"Jazz Poem Two (Poem)",                     type:"poem",   kseebUrl:"https://www.kseebsolutions.com/kseeb-sslc-class-10-english-solutions-poetry-chapter-5/" },
      { id:"10e_po6", title:"Ballad of the Tempest (Poem)",             type:"poem",   kseebUrl:"https://www.kseebsolutions.com/kseeb-sslc-class-10-english-solutions-poetry-chapter-6/" },
      { id:"10e_po7", title:"The Blind Boy (Poem)",                     type:"poem",   kseebUrl:"https://www.kseebsolutions.com/kseeb-sslc-class-10-english-solutions-poetry-chapter-7/" },
      { id:"10e_po8", title:"Off to Outer Space Tomorrow Morning (Poem)",type:"poem",  kseebUrl:"https://www.kseebsolutions.com/kseeb-sslc-class-10-english-solutions-poetry-chapter-8/" },
      // Supplementary
      { id:"10e_s1",  title:"Narayanpur Incident (Supplementary)",      type:"supplementary", kseebUrl:"https://www.kseebsolutions.com/kseeb-sslc-class-10-english-solutions-supplementary-reader-chapter-1/" },
      { id:"10e_s2",  title:"On Top of the World (Supplementary)",      type:"supplementary", kseebUrl:"https://www.kseebsolutions.com/kseeb-sslc-class-10-english-solutions-supplementary-reader-chapter-2/" },
    ],
  },
};

export const CLASS_COLORS: Record<string, string> = {
  "8":  "#6366f1",
  "9":  "#10b981",
  "10": "#f59e0b",
};

export const TYPE_LABELS: Record<string, string> = {
  prose:         "📖 Prose",
  poem:          "🎵 Poem",
  supplementary: "📚 Supplementary",
  grammar:       "✏️ Grammar",
};

export const STATUS_COLORS: Record<string, string> = {
  not_started: "#94a3b8",
  reading:     "#f59e0b",
  done:        "#10b981",
};

export const STATUS_LABELS: Record<string, string> = {
  not_started: "Not Started",
  reading:     "Reading",
  done:        "Done ✓",
};
