// Minimal, consistent stroke-based icon set — replaces emoji throughout the app.
const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function ChurchLogo(props) {
  return (
    <svg {...base} width={22} height={22} {...props}>
      <path d="M12 3v3M10 4.5h4" />
      <path d="M12 6l7 5v10H5V11l7-5z" />
      <path d="M9.5 21v-6a2.5 2.5 0 0 1 5 0v6" />
    </svg>
  );
}
export function MenuIcon(props) { return (<svg {...base} {...props}><path d="M4 7h16M4 12h16M4 17h16" /></svg>); }
export function SunIcon(props) { return (<svg {...base} {...props}><circle cx="12" cy="12" r="4.5" /><path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>); }
export function MoonIcon(props) { return (<svg {...base} {...props}><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></svg>); }
export function LogOutIcon(props) { return (<svg {...base} {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></svg>); }
export function SearchIcon(props) { return (<svg {...base} {...props}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>); }
export function HeartIcon({ filled, ...props }) {
  return (
    <svg {...base} fill={filled ? "currentColor" : "none"} {...props}>
      <path d="M12 20.5s-7.5-4.6-9.7-9.2C.8 8 2 4.8 5.2 3.9c2-.6 4 .1 5.3 1.9l1.5 2 1.5-2c1.3-1.8 3.3-2.5 5.3-1.9 3.2.9 4.4 4.1 2.9 7.4-2.2 4.6-9.7 9.2-9.7 9.2z" />
    </svg>
  );
}
export function CommentIcon(props) { return (<svg {...base} {...props}><path d="M21 12a8 8 0 0 1-8 8H7l-4 3 .8-4.5A8 8 0 1 1 21 12z" /></svg>); }
export function BookmarkIcon({ filled, ...props }) {
  return (
    <svg {...base} fill={filled ? "currentColor" : "none"} {...props}>
      <path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4-7 4V4.5a1 1 0 0 1 1-1z" />
    </svg>
  );
}
export function EditIcon(props) { return (<svg {...base} {...props}><path d="M4 20.5l.9-4L16.5 5.9a2 2 0 0 1 2.8 0l.8.8a2 2 0 0 1 0 2.8L8.5 20l-4.5.5z" /><path d="M14.5 7.5l3 3" /></svg>); }
export function TrashIcon(props) { return (<svg {...base} {...props}><path d="M4.5 7h15M9.5 7V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v2M6.5 7l1 12.5A1.5 1.5 0 0 0 9 21h6a1.5 1.5 0 0 0 1.5-1.5L17.5 7" /></svg>); }
export function CameraIcon(props) { return (<svg {...base} {...props}><path d="M4 8.5h3l1.5-2h7L17 8.5h3a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a1 1 0 0 1 1-1z" /><circle cx="12" cy="14" r="3.3" /></svg>); }
export function PhoneIcon(props) { return (<svg {...base} {...props}><path d="M6 3.5h3l1.5 4L8.5 9a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A17 17 0 0 1 4.5 5.1 1.5 1.5 0 0 1 6 3.5z" /></svg>); }
export function GlobeIcon(props) { return (<svg {...base} {...props}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>); }
export function PlusIcon(props) { return (<svg {...base} {...props}><path d="M12 5v14M5 12h14" /></svg>); }
export function XIcon(props) { return (<svg {...base} {...props}><path d="M6 6l12 12M18 6L6 18" /></svg>); }
export function CheckIcon(props) { return (<svg {...base} {...props}><path d="M4 12.5l5 5L20 6.5" /></svg>); }
export function BriefcaseIcon(props) { return (<svg {...base} {...props}><path d="M4 8h16v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8z" /><path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></svg>); }
export function GraduationCapIcon(props) { return (<svg {...base} {...props}><path d="M12 4L2 9l10 5 10-5-10-5z" /><path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5" /></svg>); }
export function UsersIcon(props) { return (<svg {...base} {...props}><circle cx="9" cy="8" r="3" /><path d="M4 20a5 5 0 0 1 10 0" /><circle cx="17" cy="9" r="2.3" /><path d="M14.7 20a4 4 0 0 1 6.8 0" /></svg>); }
export function SendIcon(props){return <svg {...base} {...props}><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>}
export function MessageIcon(props){return <svg {...base} {...props}><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H7l-4 2 1.5-4.5A7.5 7.5 0 1 1 20 11.5z"/></svg>}
export function BellIcon(props){return <svg {...base} {...props}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>}
export function HomeIcon(props){return <svg {...base} {...props}><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></svg>}
export function UsersPlusIcon(props){return <svg {...base} {...props}><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0M17 8v6M14 11h6"/></svg>}
export function GroupIcon(props){return <svg {...base} {...props}><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 5.8M16 14a5 5 0 0 1 5 5"/></svg>}
export function VideoIcon(props){return <svg {...base} {...props}><rect x="3" y="5" width="13" height="14" rx="2"/><path d="m16 10 5-3v10l-5-3z"/></svg>}
export function MoreIcon(props){return <svg {...base} {...props}><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/></svg>}
