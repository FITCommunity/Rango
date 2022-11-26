const rankedRoles = {
  "Kolizija - 2": {
    Previous: "",
    Next: "",
    Kolizija: ""
  },
  "Prva godina": {
    Previous: "",
    Next: "Druga godina",
    Kolizija: "Kolizija - 2"
  },
  "Kolizija - 3": {
    Previous: "",
    Next: "",
    Kolizija: ""
  },
  "Druga godina": {
    Previous: "Prva godina",
    Next: "Treća godina",
    Kolizija: "Kolizija - 3"
  },
  "Kolizija - 4": {
    Previous: "",
    Next: "",
    Kolizija: ""
  },
  "Treća godina": {
    Previous: "Druga godina",
    Next: "Četvrta godina",
    Kolizija: "Kolizija - 4"
  },
  "Četvrta godina": {
    Previous: "Treća godina",
    Next: "",
    Kolizija: ""
  },
  Apsolvent: {
    Previous: "",
    Next: "",
    Kolizija: ""
  },
  Imatrikulant: {
    Previous: "",
    Next: "",
    Kolizija: ""
  }
};

export default rankedRoles;
