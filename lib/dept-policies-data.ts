export type PolicySection = {
  heading: string;
  body: string;
};

export type DeptPolicy = {
  id: string;
  number: string;        // e.g. "BCSO.001"
  docNumber: string;     // e.g. "BCSO.0001" (formatted directive number)
  title: string;
  effectiveDate: string;
  lastUpdated: string;
  sections: PolicySection[];
};

export const DEPT_POLICIES: DeptPolicy[] = [
  {
    id: "bcso-001",
    number: "BCSO.001",
    docNumber: "BCSO.0001",
    title: "Vehicle Pursuit Policy",
    effectiveDate: "10/17/2025",
    lastUpdated: "02/21/2026",
    sections: [
      {
        heading: "Purpose",
        body: `The purpose of this policy is to maximize the Member's safety, the safety of the motoring public, and to minimize liability exposure. With this in mind, this policy shall serve as a framework for sworn officers of the Department to make a reasonable determination, consistent with the provisions of policy and in accordance with their training, whether to engage in, or continue, a pursuit.`,
      },
      {
        heading: "Definitions",
        body: `**Vehicle Pursuit** — An active effort by a motor vehicle operator to avoid being lawfully stopped by a deputy through the use of maneuvers such as: speeds in excess of the posted limit, sudden un-signalled turns, unlawful and dangerous passing, disregarding traffic control devices, and reckless driving.

**Violator** — The broad definition includes motorists who have committed some form of traffic violation or other justification for a deputy to conduct a traffic stop on a vehicle.

**Pursuit Intervention Technique (PIT)** — A forcible stopping technique where controlled intentional contact with a violator vehicle is initiated by a police vehicle to bring the violator vehicle to a stop.

**Tire Deflation Device** — Also referred to as spike strips, designed to puncture vehicle tires using hollow quills or spikes causing a rapid controlled deflation of the tire(s) while minimizing loss of vehicle control.

**Blocking In Place** — A Vehicle Containment Tactic that is considered a less lethal use of force. The tactic involves coordinated movement of two or more police vehicles to close off a suspect vehicle's means of escape.`,
      },
      {
        heading: "Policy",
        body: `Deputies of the Blaine County Sheriff's Office may initiate or continue a vehicle pursuit only when the necessity of apprehension outweighs the risk created by the pursuit. Deputies shall continuously assess the risk factors throughout any pursuit.

A pursuit may be initiated when:
- The suspect has committed or is suspected of committing a felony or serious misdemeanor
- The suspect poses an imminent threat to public safety
- The deputy has reasonable grounds to believe the suspect is fleeing to avoid arrest

A pursuit shall be terminated when:
- The risks to the public or deputies outweigh the need to apprehend
- Directed to terminate by a supervisor
- The pursuit leaves the department's jurisdiction without supervisory approval
- The deputy loses visual contact and cannot safely re-establish it`,
      },
      {
        heading: "Procedures",
        body: `**Initiating a Pursuit:**
Deputies initiating a pursuit shall immediately notify dispatch with: unit number, location, direction of travel, vehicle description, and reason for pursuit.

**Supervisor Authorization:**
All pursuits require supervisor notification within sixty (60) seconds of initiation. A supervisor may authorize continuation, restrict the number of units, or order termination.

**Unit Limitations:**
No more than two (2) marked units and one (1) supervisor unit shall actively participate in a pursuit unless otherwise authorized by Watch Command (Lieutenant+).

**PIT Maneuver Authorization:**
The PIT maneuver is authorized only with supervisor approval and only when the suspect poses a serious threat to public safety. The PIT shall not be used at speeds exceeding 35 mph unless exigent circumstances exist.

**Post-Pursuit Reporting:**
A pursuit report shall be submitted within three (3) days of completion, regardless of outcome, documenting all units involved, reason for initiation, termination details, and any use of force.`,
      },
    ],
  },
  {
    id: "bcso-002",
    number: "BCSO.002",
    docNumber: "BCSO.0002",
    title: "Suspect Detention & Arrest Policy",
    effectiveDate: "12/06/2025",
    lastUpdated: "02/21/2026",
    sections: [
      {
        heading: "Purpose",
        body: `The purpose of this policy is to establish clear and legally sound guidelines for arrests, detentions, hand restraint procedures, and protective custody actions conducted by deputies of the Blaine County Sheriff's Office. This policy ensures enforcement actions are carried out safely, professionally, and in compliance with applicable laws and constitutional standards.

It also promotes consistent decision-making, proper documentation, and accountability, while prioritizing the safety of deputies, subjects, and the public and ensuring fair treatment of all individuals encountered.`,
      },
      {
        heading: "Definitions",
        body: `**Arrest** — The lawful taking of a person into custody based on probable cause or other legal authority for the purpose of charging them with a criminal offense.

**Detention** — The temporary restriction of a person's freedom of movement for investigative or safety purposes. A detention does not always constitute an arrest and may or may not involve the use of hand restraints.

**Probable Cause** — Facts and circumstances within a deputy's knowledge that would lead a reasonable person to believe that a crime has been committed and that the subject committed it.

**Hand Restraints** — Mechanical devices, including handcuffs, used to restrict a subject's movement for officer safety and scene control. Subjects shall not be secured to patrol vehicles, push bars, or fixed objects.

**Custodial Search** — A lawful search of a detained or arrested subject's person and possessions conducted to locate weapons, contraband, or evidence.

**Proactive Custody (5150 Hold)** — The involuntary detention of a person for up to 72 hours due to a qualifying mental health condition when the individual is a danger to themselves, a danger to others, or gravely disabled.

**Gravely Disabled** — A condition in which a person, due to mental illness, is unable to provide for their basic personal needs for food, clothing, or shelter.

**Waiver of Rights** — The advice provided to a subject in custody informing them of their constitutional rights prior to interrogation.

**Use of Force** — The level of physical control applied by a deputy that is objectively reasonable and necessary to effect an arrest, prevent escape, or ensure safety.`,
      },
      {
        heading: "Directive",
        body: `Deputies of the Blaine County Sheriff's Office are authorized to make arrests when lawful authority exists and shall do so based on probable cause or other legal justification. All arrests and detentions shall be conducted in a professional, lawful, and safe manner, using only the level of force reasonably necessary to effect the arrest and ensure the safety of deputies, subjects, and the public.

Deputies shall evaluate each situation based on the totality of the circumstances. Detention without lawful cause may result in legal liability and disciplinary action.

**Arrest Authority & Decision-Making**
Prior to effecting an arrest or placing a subject in restraints, deputies shall consider:
- Was the subject the primary offender?
- What does the penal code authorize? Is arrest permissible for the offense?
- Would a citation and release suffice?
- How is the subject acting? Are they cooperative, evasive, or a safety risk?

Not every detention requires arrest or placement in a patrol vehicle. Deputies shall exercise sound judgment and treat each situation on a case-by-case basis while prioritizing safety. If uncertain about probable cause or arrest authority, deputies shall consult a supervisor prior to proceeding.

**Hand Restraint & Custodial Procedures**
When a deputy determines a subject shall be placed in hand restraints, the following procedures shall be followed:
- Instruct the subject to step away from the deputy and, if able, place their hands out to their sides.
- Apply hand restraints. Subjects shall never be cuffed to a patrol vehicle, push bar, or fixed object.
- Conduct a custodial search of the subject's person and possessions.
- Place the subject in the rear of the patrol vehicle for safekeeping when appropriate.
- Inventory and properly bag any items located on the subject as evidence.
- Advise the subject of their waiver of rights prior to continuing the arrest or interrogation process.

While escorting a handcuffed subject, deputies shall maintain physical control of the individual and utilize the /grab technique.

**Scene Detention & Holding**
All subjects involved in an incident who require detention may be handcuffed and secured in the rear of an available patrol vehicle for safety and scene control. Not all detentions require hand restraints. Deputies shall assess subject behavior, body language, threat level, and overall scene dynamics before determining whether restraints are necessary. Deputies may temporarily detain a subject without handcuffs when appropriate to safely complete the investigation.

If further investigation or questioning is required beyond the scope of the scene, the subject shall be transported to a Sheriff's Office or other appropriate police facility to continue the formal interrogation or arrest process.

**Protective Custody — 5150 Mental Health Detentions**
Deputies are authorized to detain individuals for their own safety or the safety of the public when legal criteria are met under the 5150 statute. A 5150 hold permits involuntary detention for up to 72 hours when a person, due to a mental illness or severe mental episode, meets at least one of the following criteria:
- Is a danger to others
- Is a danger to themselves
- Is gravely disabled

If a Patrol Deputy upholds a 5150 detention, San Andreas Fire Rescue (SAFR) personnel shall be requested to evaluate the subject's medical condition. SAFR shall assist with appropriate medical clearance and transport to a local medical facility when required. Deputies shall clearly articulate the basis for the hold in all reports.

**Arrest Completion & Documentation**
Deputies shall:
- Inform arrested individuals of the reason for their arrest when practical.
- Secure any weapons, contraband, or evidence.
- Properly document all arrests, detentions, searches, and protective custody holds in the CAD system and any required departmental reports.

All interactions shall reflect professionalism and respect. Failure to comply with this policy may result in corrective or disciplinary action.`,
      },
    ],
  },
  {
    id: "bcso-003",
    number: "BCSO.003",
    docNumber: "BCSO.0003",
    title: "Supervisor Request & Response Policy",
    effectiveDate: "10/17/2025",
    lastUpdated: "02/21/2026",
    sections: [
      { heading: "Purpose", body: "This policy governs when deputies are required to request a supervisor and how supervisors are expected to respond." },
      { heading: "Policy", body: "Deputies shall request a supervisor for: use of force incidents, pursuits, complaints from the public, serious traffic accidents involving injury, and any situation where supervisor guidance is needed. Supervisors shall respond promptly to all requests." },
      { heading: "Response Standards", body: "On-duty supervisors shall acknowledge a supervisor request via radio within two (2) minutes. If unavailable, the next available supervisor assumes responsibility. Watch Command shall be notified of any incident requiring supervisor response involving serious injury or use of force." },
    ],
  },
  {
    id: "bcso-004",
    number: "BCSO.004",
    docNumber: "BCSO.0004",
    title: "Female Suspect Search Policy",
    effectiveDate: "10/17/2025",
    lastUpdated: "02/21/2026",
    sections: [
      { heading: "Purpose", body: "This policy establishes procedures for the lawful and respectful search of female suspects by members of the BCSO." },
      { heading: "Policy", body: "Female suspects shall be searched by a female deputy whenever reasonably practicable. If no female deputy is available and exigent circumstances require an immediate search, a male deputy may conduct a limited pat-down for weapons only, with documentation required." },
      { heading: "Procedures", body: "All searches of female suspects shall be documented in the incident report. Pat-down searches shall be conducted professionally and only to the extent necessary to locate weapons or contraband. Strip searches are prohibited in the field under any circumstances." },
    ],
  },
  {
    id: "bcso-005",
    number: "BCSO.005",
    docNumber: "BCSO.0005",
    title: "Ride-Along Policy",
    effectiveDate: "10/17/2025",
    lastUpdated: "02/21/2026",
    sections: [
      { heading: "Purpose", body: "This policy governs civilian and inter-departmental ride-alongs with BCSO members to ensure safety and professionalism." },
      { heading: "Eligibility", body: "Ride-alongs are available to approved civilians and members of partner agencies. Probationary deputies are not eligible to host ride-alongs. All ride-along participants must be approved through the Chain of Command prior to participation." },
      { heading: "Procedures", body: "Ride-along participants shall be briefed on safety procedures before departure. Deputies hosting ride-alongs remain fully responsible for the participant's safety at all times. Participants shall not be permitted at scenes involving active use of force, pursuits, or other high-risk situations." },
    ],
  },
  {
    id: "bcso-006",
    number: "BCSO.006",
    docNumber: "BCSO.0006",
    title: "Cruise Lights Usage Policy",
    effectiveDate: "10/17/2025",
    lastUpdated: "02/21/2026",
    sections: [
      { heading: "Purpose", body: "This policy governs the authorized use of cruise lights (steady-burn emergency lights without siren) by BCSO members during patrol operations." },
      { heading: "Authorized Use", body: "Cruise lights may be used when: conducting a stationary traffic stop, directing traffic at an accident scene, parked at a scene requiring visibility, or when authorized by a supervisor for community events. Cruise lights shall not be used as a substitute for full emergency lighting during active pursuits or Code 3 responses." },
      { heading: "Restrictions", body: "Deputies shall not use cruise lights while in motion as a general practice. Use of cruise lights does not grant right-of-way. Unmarked vehicles are not authorized for cruise light use unless specifically equipped and authorized by the Chain of Command." },
    ],
  },
  {
    id: "bcso-007",
    number: "BCSO.007",
    docNumber: "BCSO.0007",
    title: "DUI Investigations & SFSTs Policy",
    effectiveDate: "10/17/2025",
    lastUpdated: "02/21/2026",
    sections: [
      { heading: "Purpose", body: "This policy establishes procedures for conducting DUI investigations and administering Standardized Field Sobriety Tests (SFSTs) in accordance with departmental training and state law." },
      { heading: "SFST Authorization", body: "Only deputies certified through the BCSO Continuing Education Program (SFST's Training) are authorized to administer SFSTs. Uncertified deputies may assist with the stop but shall request a certified deputy to conduct testing." },
      { heading: "Procedures", body: "Deputies shall conduct SFSTs on a flat, well-lit surface when possible. All three standardized tests shall be administered in sequence: Horizontal Gaze Nystagmus (HGN), Walk-and-Turn, and One-Leg Stand. Results and observations shall be documented thoroughly in the DUI Report submitted within three (3) days." },
    ],
  },
  {
    id: "bcso-008",
    number: "BCSO.008",
    docNumber: "BCSO.0008",
    title: "Unmarked Vehicle Policy",
    effectiveDate: "10/17/2025",
    lastUpdated: "02/21/2026",
    sections: [
      { heading: "Purpose", body: "This policy governs the use and operation of unmarked vehicles by authorized BCSO members." },
      { heading: "Authorization", body: "Unmarked vehicles are authorized for use by Lieutenant and above. Deputies below the rank of Lieutenant are not authorized to operate unmarked patrol vehicles. Unmarked vehicles used in undercover operations require explicit authorization from the Chain of Command." },
      { heading: "Restrictions", body: "Unmarked vehicles shall use civilian-style license plates formatted per the License Plate Policy. Government plates (BCSO, State) shall not be used on unmarked vehicles. Unmarked vehicles shall not respond Code 3 without supervisor authorization except in exigent circumstances involving immediate threat to life." },
    ],
  },
  {
    id: "bcso-009",
    number: "BCSO.009",
    docNumber: "BCSO.0009",
    title: "Plain Clothes Usage Policy",
    effectiveDate: "10/17/2025",
    lastUpdated: "02/21/2026",
    sections: [
      { heading: "Purpose", body: "This policy establishes standards for the use of plain clothes attire by authorized BCSO members during official operations." },
      { heading: "Authorization", body: "Plain clothes operations require prior authorization from the Chain of Command (Lieutenant+). Members in plain clothes shall carry their department-issued identification and badge at all times and shall identify themselves as law enforcement when making contact with the public in an official capacity." },
      { heading: "Restrictions", body: "Plain clothes deputies shall not conduct traffic stops unless exigent circumstances exist and they have a clearly marked police vehicle or supervisor authorization. All plain clothes operations shall be documented and reported to the authorizing supervisor upon completion." },
    ],
  },
  {
    id: "bcso-010",
    number: "BCSO.010",
    docNumber: "BCSO.0010",
    title: "Firearm Usage Policy",
    effectiveDate: "10/17/2025",
    lastUpdated: "02/21/2026",
    sections: [
      { heading: "Purpose", body: "This policy establishes standards for the authorized use, carry, and discharge of firearms by members of the Blaine County Sheriff's Office to ensure public safety and officer accountability." },
      { heading: "Authorization", body: "All sworn BCSO members are authorized to carry their department-issued or approved personal firearm while on duty. Off-duty carry is permitted and encouraged in accordance with departmental guidelines. Members shall qualify with their issued firearm on a schedule determined by the Training Division." },
      { heading: "Use of Force", body: "Deputies may discharge their firearm only when necessary to protect themselves or another person from imminent serious bodily harm or death, or to stop a fleeing felon who poses an imminent threat to public safety. Warning shots are prohibited. Shooting at or from moving vehicles is prohibited unless the vehicle is being used as a deadly weapon against the deputy or others." },
      { heading: "Procedures", body: "Any discharge of a firearm (outside of training) shall be immediately reported to a supervisor and documented in a Use of Force report submitted within 24 hours. The involved deputy shall be placed on administrative assignment pending review by the Chain of Command and, if applicable, the Professional Standards Unit." },
    ],
  },
  {
    id: "bcso-011",
    number: "BCSO.011",
    docNumber: "BCSO.0011",
    title: "UC Vehicle Policy",
    effectiveDate: "10/17/2025",
    lastUpdated: "02/21/2026",
    sections: [
      { heading: "Purpose", body: "This policy governs the use of undercover (UC) vehicles by authorized BCSO members during covert operations and plainclothes assignments." },
      { heading: "Authorization", body: "UC vehicles are authorized for use exclusively by members conducting approved undercover operations with explicit authorization from Lieutenant or above. UC vehicles shall not be used as standard patrol vehicles or for personal use under any circumstances." },
      { heading: "Vehicle Standards", body: "UC vehicles shall maintain civilian appearance and shall not display any government markings, BCSO insignia, or law enforcement equipment that would be visible from outside the vehicle during covert operation. All UC vehicle use shall be logged and reported to the authorizing supervisor." },
      { heading: "Restrictions", body: "UC vehicles shall not be used to conduct traffic stops or respond Code 3 except in exigent circumstances involving an immediate threat to life, and only with supervisor authorization. Any incidents involving a UC vehicle shall be reported within 24 hours." },
    ],
  },
  {
    id: "bcso-012",
    number: "BCSO.012",
    docNumber: "BCSO.0012",
    title: "Off Duty Roleplay Policy",
    effectiveDate: "10/17/2025",
    lastUpdated: "02/21/2026",
    sections: [
      { heading: "Purpose", body: "This policy establishes standards and expectations for BCSO members while engaged in off-duty roleplay activities to maintain the integrity and professional reputation of the department." },
      { heading: "Policy", body: "BCSO members are ambassadors of the department at all times. Off-duty conduct that would bring discredit to the department, including participation in activities that contradict departmental values or create conflicts of interest, is prohibited. Members shall not represent themselves as BCSO members while engaging in activities inconsistent with departmental standards." },
      { heading: "Prohibited Conduct", body: "Members shall not: engage in criminal activity while off duty; use their BCSO affiliation to gain improper advantage; participate in activities that create a public perception of bias or corruption; or engage with rival factions or organizations in a manner that compromises their impartiality as a law enforcement officer." },
      { heading: "Reporting", body: "Members who become aware of off-duty conduct by fellow members that may violate this policy shall report such conduct to their immediate supervisor or through the Professional Standards Unit. Failure to report known violations may itself constitute a policy violation." },
    ],
  },
];
