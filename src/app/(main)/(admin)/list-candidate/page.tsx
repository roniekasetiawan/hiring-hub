import PageID from "@/@core/components/PageID";
import CandidateTable from "@/components/(data-display)/table";
import { Typography } from "@mui/material";

interface Candidate {
  id: number;
  namaLengkap: string;
  emailAddress: string;
  phoneNumbers: string;
  dateOfBirth: string;
  domicile: string;
  gender: "Male" | "Female";
  linkLinkedin: string;
}

const mockCandidates: Candidate[] = [
  {
    id: 1,
    namaLengkap: "Aurelie Yokiko",
    emailAddress: "aurelieyukiko@yahoo.com",
    phoneNumbers: "082120908766",
    dateOfBirth: "30 January 2001",
    domicile: "Jakarta",
    gender: "Female",
    linkLinkedin: "https://www.linkedin.com/in/aurelie",
  },
  {
    id: 2,
    namaLengkap: "Dityo Hendyawan",
    emailAddress: "dityohendyawan@...com",
    phoneNumbers: "081184180678",
    dateOfBirth: "15 May 1999",
    domicile: "Bandung",
    gender: "Male",
    linkLinkedin: "https://www.linkedin.com/in/dityo",
  },
  {
    id: 3,
    namaLengkap: "Mira Workman",
    emailAddress: "miraworkman@yahoo.com",
    phoneNumbers: "081672007108",
    dateOfBirth: "22 August 2002",
    domicile: "Surabaya",
    gender: "Female",
    linkLinkedin: "https://www.linkedin.com/in/mira",
  },
  {
    id: 4,
    namaLengkap: "Paityn Culhane",
    emailAddress: "paitynculhane@yahoo.com",
    phoneNumbers: "081521500714",
    dateOfBirth: "05 March 2000",
    domicile: "Jakarta",
    gender: "Male",
    linkLinkedin: "https://www.linkedin.com/in/paityn",
  },
  {
    id: 5,
    namaLengkap: "Emerson Baptista",
    emailAddress: "emersonbaptista@yah...com",
    phoneNumbers: "082167008244",
    dateOfBirth: "19 November 1998",
    domicile: "Yogyakarta",
    gender: "Male",
    linkLinkedin: "https://www.linkedin.com/in/emerson",
  },
  {
    id: 6,
    namaLengkap: "Indra Zen",
    emailAddress: "indrazen@yahoo.com",
    phoneNumbers: "081181630568",
    dateOfBirth: "30 January 2001",
    domicile: "Jakarta",
    gender: "Male",
    linkLinkedin: "https://www.linkedin.com/in/indra",
  },
  {
    id: 7,
    namaLengkap: "Joyce",
    emailAddress: "joyce@yahoo.com",
    phoneNumbers: "084288771015",
    dateOfBirth: "12 July 2003",
    domicile: "Bali",
    gender: "Female",
    linkLinkedin: "https://www.linkedin.com/in/joyce",
  },
  {
    id: 8,
    namaLengkap: "Eriberto",
    emailAddress: "eriberto@yahoo.com",
    phoneNumbers: "083862419121",
    dateOfBirth: "01 February 1997",
    domicile: "Medan",
    gender: "Male",
    linkLinkedin: "https://www.linkedin.com/in/eriberto",
  },
  {
    id: 9,
    namaLengkap: "Javon",
    emailAddress: "javon@yahoo.com",
    phoneNumbers: "083283445502",
    dateOfBirth: "25 December 2001",
    domicile: "Jakarta",
    gender: "Male",
    linkLinkedin: "https://www.linkedin.com/in/javon",
  },
  {
    id: 10,
    namaLengkap: "Emory",
    emailAddress: "emory@yahoo.com",
    phoneNumbers: "087188286367",
    dateOfBirth: "30 April 2000",
    domicile: "Semarang",
    gender: "Male",
    linkLinkedin: "https://www.linkedin.com/in/emory",
  },
  {
    id: 11,
    namaLengkap: "Ella",
    emailAddress: "ella@yahoo.com",
    phoneNumbers: "088306913834",
    dateOfBirth: "18 June 1999",
    domicile: "Makassar",
    gender: "Female",
    linkLinkedin: "https://www.linkedin.com/in/ella",
  },
  {
    id: 12,
    namaLengkap: "Sylvan",
    emailAddress: "sylvan@yahoo.com",
    phoneNumbers: "087752105228",
    dateOfBirth: "09 September 2001",
    domicile: "Jakarta",
    gender: "Male",
    linkLinkedin: "https://www.linkedin.com/in/sylvan",
  },
];

export default function JobListPage() {
  return (
    <PageID
      title="Management Menu"
      path="/config/manage-menu"
      breadcrumbs={{
        title: "Management Menu",
        routes: [
          { label: "Konfigurasi" },
          { label: "Management Menu", href: "/config/manage-menu" },
          { label: "Detail Menu" },
        ],
      }}
    >
      <Typography variant="h3" color="black" mb={3}>
        Front End Developer
      </Typography>
      <CandidateTable mockCandidates={mockCandidates} paginateBy={10} />
    </PageID>
  );
}
