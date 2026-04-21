export type SopSubsection = {
  id: string;
  number: string;
  title: string;
  content: string;
};

export type SopSection = {
  id: string;
  number: string;
  title: string;
  subsections: SopSubsection[];
};

export const SOP_DATA: SopSection[] = [
  {
    id: "section-1",
    number: "I",
    title: "General Provisions",
    subsections: [
      {
        id: "1-1", number: "1.1", title: "Purpose & Scope",
        content: `The purpose of this Standard Operating Procedure (SOP) is to establish clear policies, procedures, and expectations governing the operations of the Blaine County Sheriff's Office. This SOP applies to all sworn and reserve members while on duty, when acting under the authority of the office, or when representing the department in any official capacity, and is intended to ensure professional, consistent, and accountable law enforcement operations.`,
      },
      {
        id: "1-2", number: "1.2", title: "Authority of the Sheriff",
        content: `The Sheriff of Blaine County is the chief executive and law enforcement authority of the Blaine County Sheriff's Office and retains full responsibility for the administration, direction, and enforcement of departmental operations and policy. The Sheriff may delegate authority to command staff as necessary; however, such delegation does not relieve the Sheriff of ultimate responsibility for the conduct and performance of the office.`,
      },
      {
        id: "1-3", number: "1.3", title: "Mission",
        content: `The mission of the Blaine County Sheriff's Office is to protect the citizens of Blaine County by preserving the peace and providing a safe and secure community through professional, ethical, and responsive law enforcement services. In partnership with our community, we are committed to protecting the rights and dignity of all persons while remaining effective, accountable, and adaptable to the needs of those we serve.`,
      },
      {
        id: "1-4", number: "1.4", title: "Core Values",
        content: `The members of the Blaine County Sheriff's Office are guided by the following core values, which serve as the foundation for all decisions, actions, and interactions:

**Integrity** – We uphold the highest ethical standards, value public trust, and hold ourselves accountable for honest and principled conduct.

**Excellence** – We strive for excellence in service through professionalism, continuous improvement, and strong community partnerships.

**Fairness & Impartiality** – We perform our duties fairly and impartially while safeguarding constitutional rights.

**Respect** – We treat all individuals with dignity, kindness, and respect, and practice procedural justice in all interactions.

**Teamwork** – We work together as one organization, valuing collaboration, mutual respect, and shared responsibility in serving our community.`,
      },
      {
        id: "1-5", number: "1.5", title: "Policy Compliance",
        content: `All members of the Blaine County Sheriff's Office shall comply with this Standard Operating Procedure and all lawful orders, directives, and policies issued by the Office of the Sheriff. Members are responsible for maintaining familiarity with current policies and procedures. Failure to comply may result in corrective or disciplinary action in accordance with departmental standards and the Chain of Command.`,
      },
      {
        id: "1-6", number: "1.6", title: "Policy Interpretation",
        content: `This Standard Operating Procedure is intended to provide guidance for departmental operations and does not replace lawful orders or supervisory direction. In the event of a conflict, community-wide policy, lawful orders, or directives issued by the Chain of Command shall take precedence.`,
      },
      {
        id: "1-7", number: "1.7", title: "Amendments & Review",
        content: `This Standard Operating Procedure is subject to ongoing review and may be amended, revised, or rescinded at any time at the direction of the Sheriff or designated command staff. Policy updates shall be communicated to members, and continued service constitutes acknowledgment of and compliance with the most current version.`,
      },
    ],
  },
  {
    id: "section-2",
    number: "II",
    title: "Administration & Organization",
    subsections: [
      {
        id: "2-1", number: "2.1", title: "Administration & Organization Introduction",
        content: `This section establishes the administrative framework and organizational structure of the Blaine County Sheriff's Office. It defines the authority, responsibilities, and relationships necessary to ensure effective leadership, accountability, and the efficient operation of the department.

The policies contained within this section outline how authority is exercised, how responsibilities are delegated, and how members are expected to function within the organizational hierarchy. All members, sworn and civilian, are required to understand and operate within this framework to support effective communication, supervision, and mission accomplishment.`,
      },
      {
        id: "2-2", number: "2.2", title: "Organizational Structure",
        content: `The Blaine County Sheriff's Office is organized to maintain clear lines of authority, accountability, and supervision.

**Administration**
- Sheriff
- Undersheriff
- Chief Deputy
- Colonel

**Senior Staff**
- Captain
- Lieutenant

**Staff**
- Staff Sergeant
- Sergeant

**Staff in Training**
- Corporal

**Member**
- Master Deputy
- Senior Deputy
- Deputy
- Probationary Deputy`,
      },
      {
        id: "2-3", number: "2.3", title: "Chain of Command Positions",
        content: `The following ranks constitute the Chain of Command of the Blaine County Sheriff's Office (BCSO). Members holding these ranks are responsible for supervision, leadership, and enforcement of departmental policy.

**Sheriff** – The head of the BCSO with final authority over all departmental operations, policies, personnel decisions, and disciplinary actions.

**Undersheriff** – Second-in-command and co-head, overseeing all operational and administrative functions. Assumes duties of the Sheriff in their absence.

**Chief Deputy** – Serves as the Patrol Operations Bureau Commander providing oversight of all patrol operations and the Professional Standards Bureau (PSB).

**Colonel** – Serves as the Division Operations Bureau Commander, overseeing all investigative, specialty, and support divisions.

**Captain (Patrol Operations Bureau)** – Oversees day-to-day patrol operations and is responsible for supervision of patrol supervisors and deployment of patrol resources.

**Captain (Subdivision Operations Bureau)** – Oversees all assigned divisions and specialty units, ensuring operational effectiveness and training compliance.

**Captain (Professional Standards Bureau)** – Oversees training, compliance, and internal standards. Responsible for departmental training programs and policy adherence.

**Lieutenant (Patrol Operations Bureau)** – Supervises patrol operations under the direction of the POB Captain. Manages shift-level operations.

**Lieutenant (Subdivision Operations Bureau)** – Supervises assigned divisions and specialty units under the SOB Captain.

**Lieutenant (Professional Standards Bureau)** – Assists in overseeing training programs, compliance efforts, and internal standards.

**Staff Sergeant** – Senior field supervisors assisting with coordination of patrol operations, training oversight, and scene management.

**Sergeant** – First-line supervisors responsible for direct supervision of patrol operations, scene management, and enforcement of departmental policy.

**Corporal** – Entry-level supervisory rank assisting with field supervision, training of probationary members, and enforcement of departmental standards.`,
      },
      {
        id: "2-4", number: "2.4", title: "Full-Time Positions",
        content: `**Master Deputy** – Experienced deputies who demonstrate high proficiency, professionalism, and leadership. May serve as mentors, trainers, or subject-matter resources.

**Senior Deputy** – Fully qualified deputies who perform independent patrol duties and complex assignments with minimal supervision.

**Deputy** – Sworn law enforcement members responsible for enforcing laws, responding to calls for service, conducting investigations, and performing patrol duties.

**Probationary Deputy** – Newly appointed members completing required training and evaluation periods. Operate under close supervision.`,
      },
      {
        id: "2-5", number: "2.5", title: "Reserve & Honorary Positions",
        content: `The BCSO may maintain reserve and honorary positions as authorized by the Office of the Sheriff or Chain of Command. Honorary deputies are typically leaders from other departments, while reserve officers treat BCSO as a secondary department.

Reserve and honorary deputies are **not** able to apply for:
- Field Training Officer (FTO)
- Chain of Command (CoC) positions
- Subdivision Chain of Command positions

Reserve and honorary deputies may participate in approved subdivisions as authorized by Chain of Command and are subject to all departmental policies and procedures while representing the department.`,
      },
      {
        id: "2-6", number: "2.6", title: "Divisions & Bureaus",
        content: `**Patrol Operations Bureau** – Responsible for primary law enforcement services including calls for service, traffic enforcement, and community policing.
- Patrol Operations

**Professional Standards Bureau (PSB)** – Responsible for maintaining accountability, integrity, and ethical conduct. Oversees complaints, internal investigations, and corrective action.
- Deputy Training Advancement Course (DTAC)
- Corporal Candidate Program (CCP)

**Division Operations Bureau** – Oversees investigative, specialty, and support units.
- Traffic Enforcement Division (TED)
- Criminal Investigations Unit (CIU)
- K9 Unit
- Marine Unit
- Detention Services Unit (DSD)
- Special Weapons and Tactics (SWAT)`,
      },
    ],
  },
  {
    id: "section-3",
    number: "III",
    title: "Code of Conduct",
    subsections: [
      {
        id: "3-1", number: "3.1", title: "Professional Conduct",
        content: `All members of the Blaine County Sheriff's Office are expected to conduct themselves in a professional, ethical, and responsible manner at all times. This expectation applies while on duty, off duty when acting under the authority of the Office, and whenever representing the department in an official capacity.

Conduct that interferes with departmental operations, undermines supervision, damages public confidence, or brings discredit to the Blaine County Sheriff's Office is prohibited.`,
      },
      {
        id: "3-2", number: "3.2", title: "Ethics & Integrity",
        content: `Members shall uphold the highest standards of ethics, honesty, and integrity. Members shall not engage in any conduct intended to secure personal gain, avoid accountability, improperly influence others, or compromise the mission, credibility, or lawful operations of the Sheriff's Office.

Falsification of reports, statements, records, evidence, or any official information is strictly prohibited.`,
      },
      {
        id: "3-3", number: "3.3", title: "Courtesy, Respect & Public Interaction",
        content: `Members shall treat all members of the public, fellow employees, and partner agencies with courtesy, dignity, and respect. Interactions shall be conducted in a calm, professional, and impartial manner.

Members shall avoid the use of profanity, demeaning language, discriminatory behavior, or unnecessary hostility during any public contact. When acting in an enforcement or detention capacity, members shall identify themselves and explain the reason for the interaction when practical and safe to do so.`,
      },
      {
        id: "3-4", number: "3.4", title: "Compliance with Laws, Orders & Policies",
        content: `Members shall comply with all applicable laws as outlined in the State of San Andreas Penal Code, departmental policies, procedures, and lawful orders issued through the Chain of Command.

Members shall promptly follow supervisory direction unless doing so would be unlawful or unsafe. Ignorance of policy, procedure, or law shall not be considered a defense for violations.`,
      },
      {
        id: "3-5", number: "3.5", title: "Associations & Conflicts of Interest",
        content: `Members shall avoid associations, activities, or relationships that may reasonably compromise their integrity, objectivity, or the public's trust in the department.

Members are prohibited from soliciting or accepting compensation, favors, gifts, or privileges that could influence the performance of their official duties. Any potential conflict of interest shall be disclosed through the Chain of Command.`,
      },
      {
        id: "3-6", number: "3.6", title: "Professional Appearance",
        content: `All members shall maintain a professional appearance that reflects positively on the department.

**Hair:**
- Male and female hair shall not extend below the uniform shirt collar
- Long hair shall be secured in a neat and professional manner
- Female members with long hair shall wear it in a tight bun while on duty

**Facial Hair:**
- Beards shall be neatly groomed at all times
- Facial hair shall not extend below the adam's apple

**Tattoos:**
- Tattoos visible below uniform shirt sleeves or above the neckline must be professional in appearance
- Offensive, inappropriate, vulgar, or discriminatory tattoos are prohibited

**Body Modifications:**
- Abnormal body modifications that detract from a professional law enforcement appearance are prohibited
- This includes tooth filing, gauges, and piercings of the septum, lips, eyebrows, or tongue

**Hair Color:**
- Hair color shall remain natural at all times`,
      },
      {
        id: "3-7", number: "3.7", title: "Accountability & Responsibility",
        content: `Members are accountable for their actions, decisions, and the proper performance of their assigned duties. Supervisors are responsible for enforcing departmental standards fairly and consistently.

Members shall cooperate fully with supervisory direction, administrative reviews, and internal investigations.`,
      },
      {
        id: "3-8", number: "3.8", title: "Duty to Act & Assist",
        content: `Members have an affirmative duty to take appropriate action to protect life, preserve the peace, and enforce the law when such action is reasonably required. Members shall not fail to act when a lawful duty exists and the circumstances permit intervention.

Members are also expected to render assistance to fellow members when a need is known or when a request for assistance is made.`,
      },
      {
        id: "3-9", number: "3.9", title: "Bias-Free Policing",
        content: `The BCSO is committed to fair and impartial policing. Deputies shall not engage in biased or discriminatory practices, and all enforcement actions shall be based on lawful authority and observed behavior. Members shall treat all individuals with dignity and respect.`,
      },
      {
        id: "3-10", number: "3.10", title: "Harassment & Discrimination",
        content: `The BCSO maintains a zero-tolerance policy for harassment and discrimination. Members shall not engage in harassment, bullying, intimidation, or discriminatory conduct towards civilians, fellow deputies, or staff.

Discrimination based on race, ethnicity, gender, sexual orientation, religion, nationality, disability, or any other personal characteristic is prohibited.`,
      },
      {
        id: "3-11", number: "3.11", title: "Policy Acknowledgement",
        content: `All members are responsible for reviewing, understanding, and complying with all policies, procedures, directives, and updates issued by the Office of the Sheriff.

Continued service with the Blaine County Sheriff's Office constitutes acknowledgment of and agreement to comply with all applicable policies, procedures, and lawful orders.`,
      },
      {
        id: "3-12", number: "3.12", title: "Interagency Cooperation",
        content: `The BCSO shall work cooperatively with other law enforcement agencies and public safety organizations when necessary to support public safety and effective operations.

Deputies are authorized to provide mutual aid or assistance to other agencies when requested or when directed by Chain of Command.`,
      },
    ],
  },
  {
    id: "section-4",
    number: "IV",
    title: "Patrol & Field Operations",
    subsections: [
      {
        id: "4-1", number: "4.1", title: "Patrol Operations Overview",
        content: `Patrol Operations serve as the primary law enforcement function of the Blaine County Sheriff's Office. Deputies assigned to patrol are responsible for responding to calls for service, enforcing state and local laws, conducting proactive patrol activity, and providing community-oriented policing throughout the Sheriff's Office jurisdiction.

Patrol deputies are expected to exercise sound judgment, professionalism, and situational awareness while performing their duties.`,
      },
      {
        id: "4-2", number: "4.2", title: "Patrol Zones & Team Assignment",
        content: `Patrol zones will be established to ensure each part of Blaine County and Los Santos County are getting the right amount of coverage at all times. Zones may only go into effect when the highest on patrol places patrol zones into play.

Each month patrol zones will change for each team. Each team will be comprised of a Corporal as team lead, Sergeant as supervisor and a Staff Sergeant as team oversight.

When the Area of Patrol (AOP) is set to **Statewide**, BCSO deputies shall operate exclusively within **Zone 6, Zone 7 and Zone 8** unless authorized by a supervisor or Watch Command (Lieutenant+), or when responding to a mutual aid request or other exigent circumstances.

Deputies shall not conduct stationary radar or proactive traffic enforcement on highways or interstates. Highway enforcement is limited to emergency response, non-radar enforcement, or authorized assistance.`,
      },
      {
        id: "4-3", number: "4.3", title: "Jurisdiction & Authority",
        content: `The Blaine County Sheriff's Office holds primary law enforcement authority within Blaine County as authorized by law and community policy. Deputies are empowered to enforce laws and take lawful action within their jurisdiction while respecting the primary responsibilities of partner agencies.`,
      },
      {
        id: "4-4", number: "4.4", title: "Patrol Mission",
        content: `The mission of patrol operations is to protect life and property, uphold the law, and maintain public safety.

The primary responsibilities of patrol operations include:
- Responding to calls for service and emergencies
- Enforcing state laws
- Conducting lawful traffic stops and investigations
- Preventing and deterring criminal activity
- Maintaining public safety and order
- Assisting civilians
- Supporting interagency operations`,
      },
      {
        id: "4-5", number: "4.5", title: "Shift Briefing",
        content: `A shift briefing may be held by a member of the Chain of Command for on-duty patrol deputies. Shift briefings are only required when they are formally hosted by a Chain of Command member. All shift briefings shall be conducted in-state.

The purpose of the shift briefing is to:
- Brief officers on current BOLOs, warrants, and ongoing investigations
- Assign patrol districts and units
- Provide operational updates or directives
- Review policy reminders or training notes
- Address departmental announcements`,
      },
      {
        id: "4-6", number: "4.6", title: "Call Handling",
        content: `Patrol deputies shall respond to calls for service in a timely and professional manner and shall acknowledge and handle assigned calls as directed by dispatch or a supervisor. Refusing or abandoning an assigned call without approval is prohibited.

Deputies shall provide required status updates and document all required information using the CAD system or approved departmental reporting tools.`,
      },
      {
        id: "4-7", number: "4.7", title: "Response Classifications",
        content: `**Routine Response (Code 1)**
Non-emergency calls with no immediate threat to life or property. Officers shall respond without lights or sirens.

**Priority Response (Code 2)**
Calls requiring a prompt response due to elevated risk or potential escalation. Officers may use emergency lights and sirens only when necessary.

**Emergency Response (Code 3)**
Calls involving immediate threat to life, serious crimes in progress, or officer safety concerns. Officers may use emergency lights and sirens and shall respond as quickly and safely as possible.`,
      },
      {
        id: "4-8", number: "4.8", title: "Scene Management",
        content: `Deputies are responsible for maintaining control, safety, and professionalism at all incident scenes. The first deputy on scene shall establish scene control, assess immediate safety concerns, and take appropriate action.

When additional units arrive, scene command shall be assumed by the highest-ranking deputy present unless otherwise directed by the Chain of Command.`,
      },
      {
        id: "4-9", number: "4.9", title: "Officer Safety",
        content: `The safety of deputies is a priority of the BCSO. Deputies shall use sound judgment, situational awareness, and approved tactics when responding to calls for service, conducting enforcement actions, or managing scenes.

Deputies shall not engage in unnecessary risk-taking or unsafe behavior. When a deputy feels unsafe or requires assistance, they shall request backup or supervisory support without delay.`,
      },
      {
        id: "4-10", number: "4.10", title: "Vehicle Operations",
        content: `Deputies are authorized to operate department vehicles for official duties and shall do so safely and lawfully. Misuse, reckless driving, unauthorized modifications, or operations outside of the approved vehicle structure is prohibited.

Emergency lights and sirens shall only be used when authorized. Departmental vehicles shall be used for official purposes only, and any damage shall be reported to a supervisor.`,
      },
      {
        id: "4-11", number: "4.11", title: "Radio Traffic Only (RTO) & Self-Attaching",
        content: `All BCSO deputies shall maintain clear, concise, and professional radio traffic at all times. Unnecessary chatter, arguments, or disruptive radio behavior is prohibited.

Radio transmissions shall remain brief and generally under 10–15 seconds unless transitioning to a tactical or one-to-one channel. Priority traffic shall take precedence at all times, and full callsigns or unit designations shall be used when contacting Dispatch.

When an active dispatcher is on duty, deputies shall not self-attach to calls for service. When no dispatcher is active, deputies may self-attach only when operationally necessary. **No more than two (2) units shall respond to a 911 call** unless the call is high priority or additional units are requested.

"10-3" channel holds and radio channel locks are **not authorized**.

This policy is community-wide and enforceable by Staff In Training+ and active dispatchers.`,
      },
      {
        id: "4-12", number: "4.12", title: "Crowd Control & Civil Disturbances",
        content: `Deputies may respond to crowd control situations and civil disturbances to maintain public safety and order. Deputies shall utilize sound judgment, communication, and de-escalation techniques whenever reasonably possible.

Supervisory personnel shall assume scene command during large-scale disturbances or when directed by the Chain of Command.`,
      },
      {
        id: "4-13", number: "4.13", title: "Traffic Enforcement",
        content: `Deputies are responsible for enforcing traffic laws to promote public safety within Blaine County. Deputies are authorized to conduct traffic stops when lawful authority exists based on observed violations or reasonable suspicion.

All traffic stops shall be conducted in a professional, respectful, and impartial manner. Vehicle searches shall be conducted only when lawful authority exists.`,
      },
      {
        id: "4-14", number: "4.14", title: "Traffic Stops Involving Emergency Vehicles",
        content: `Under no circumstances shall a deputy initiate a traffic stop on an emergency vehicle that is actively on duty, including San Andreas Fire Department apparatus, BCSO units, SAHP, or Municipal Police Department vehicles.

**Only BCSO supervisors (Sergeant and above)** are authorized to conduct traffic stops involving BCSO personnel. Any deputy may initiate a traffic stop on an emergency vehicle only if the vehicle is confirmed or reasonably believed to be stolen.`,
      },
      {
        id: "4-15", number: "4.15", title: "Off-Road Vehicle Operations",
        content: `Lifted vehicles (SUVs, pickup trucks) may be operated off-road under the following conditions:
- Travel is limited to pressed or stable surfaces such as dirt, sand, or grass
- Operation on rough or hazardous terrain (mountains, cliff faces, dunes, steep grades, boulders) is **prohibited**
- Vehicles shall not be driven over or through objects that may cause damage

Sedan patrol vehicles may operate on grassland or paved dirt roads only and shall not exceed **50 mph** while doing so.`,
      },
      {
        id: "4-16", number: "4.16", title: "Specialty Vehicles",
        content: `The **2023 Chevy Camaro SS** is a specialty vehicle authorized for limited patrol and traffic enforcement use.

- Only **one (1)** patrol variant may be active at any time
- Patrol variant: Staff Sergeant+
- Unmarked variant: Lieutenant+
- Traffic variants: TED members with ADT certification or TED Command staff only

**Total specialty vehicle limits:**
- Blaine County or Los Santos AOP: Maximum two (2) — one patrol, one traffic
- Statewide AOP: Maximum three (3) — one Blaine Traffic, one Los Santos Traffic, one patrol

Deputies operating the Camaro SS shall use the appropriate TeamSpeak identifier: [SE], [BSE], or [LSE]. The vehicle shall not be operated in adverse weather conditions.`,
      },
    ],
  },
  {
    id: "section-5",
    number: "V",
    title: "Use of Force",
    subsections: [
      {
        id: "5-1", number: "5.1", title: "Use of Force Philosophy",
        content: `The BCSO is committed to using only the level of force that is objectively reasonable and necessary to accomplish lawful objectives. The primary goal of any use of force is to gain control of a situation while minimizing injury to all parties involved.

Deputies shall utilize de-escalation techniques whenever reasonably possible before resorting to force. Force shall be used only when necessary and shall be proportional to the threat or resistance encountered.`,
      },
      {
        id: "5-2", number: "5.2", title: "Use of Force Continuum",
        content: `The BCSO follows a use of force continuum to guide deputies in selecting appropriate levels of force. Deputies are required to use the lowest level of force reasonably necessary.

The use of force continuum includes:
- Deputy presence and verbal commands
- Soft control techniques
- Hard control techniques
- Less-lethal options
- Lethal force

Deputies may escalate or de-escalate force based on the actions of the subject, the level of resistance encountered, and the threat posed.`,
      },
      {
        id: "5-3", number: "5.3", title: "De-Escalation",
        content: `Deputies shall employ de-escalation techniques whenever reasonably possible to reduce the need for force. De-escalation techniques include verbal persuasion, tactical repositioning, time, distance, cover, and effective communication.

De-escalation is **not required** when attempting such techniques would place deputies or others at unreasonable risk, or when immediate action is necessary to prevent serious harm.`,
      },
      {
        id: "5-4", number: "5.4", title: "Less-Lethal Options",
        content: `The BCSO authorizes the use of less-lethal force options to gain control of a subject while reducing the risk of serious injury or death. Less-lethal options may include OC spray, baton, conducted energy devices, and beanbag shotgun.

Deputies shall only use less-lethal force when lawful authority exists and when lower levels of force are ineffective or impractical. Deputies shall provide or request medical evaluation for any individual impacted by less-lethal force when reasonably necessary.`,
      },
      {
        id: "5-5", number: "5.5", title: "Lethal Force",
        content: `The BCSO authorizes the use of lethal force **only when it is reasonably necessary to protect life**. Deputies may use lethal force when they reasonably believe such force is necessary to prevent death or serious bodily harm to themselves or others.

Lethal force shall **not** be used solely to protect property or to prevent escape unless an immediate threat to life exists. When reasonably possible, deputies shall issue clear verbal warnings prior to using lethal force.`,
      },
      {
        id: "5-6", number: "5.6", title: "Duty to Intervene",
        content: `Members have an affirmative duty to intervene when they observe another member using force that is clearly unreasonable, excessive, or unlawful. Deputies shall take reasonable steps to prevent or stop such conduct when it is safe and practical to do so.

Any observed excessive or unlawful use of force shall be reported to a supervisor as soon as reasonably practicable.`,
      },
      {
        id: "5-7", number: "5.7", title: "Firearms Policy",
        content: `Members are authorized to carry and use only approved departmental firearms in the performance of official duties when lawful authority exists.

Unauthorized discharge, misuse, or negligent handling of a firearm is prohibited. Deputies shall not carry unauthorized firearms or use unauthorized firearm modifications while on duty.`,
      },
      {
        id: "5-8", number: "5.8", title: "Vehicle-Based Force",
        content: `The BCSO authorizes the use of a vehicle as a use of force only when it is reasonably necessary to protect life. Deputies shall not intentionally use a vehicle to strike a person except when lethal force is justified.

Vehicle-based force shall not be used solely to prevent escape or to stop a fleeing suspect unless an immediate threat to life exists.`,
      },
      {
        id: "5-9", number: "5.9", title: "Prohibited Force",
        content: `Members are prohibited from using force that is unnecessary, excessive, or unlawful. The following actions are strictly prohibited:

- Use of force for punishment, retaliation, or coercion
- Use of force against a compliant or restrained individual
- Use of force to extract information or confessions
- Use of force solely to protect property
- Use of force that is clearly disproportionate to the threat or resistance encountered`,
      },
      {
        id: "5-10", number: "5.10", title: "Beanbag Shotgun (Less-Lethal Use)",
        content: `The beanbag shotgun is authorized as a less-lethal use of force. Deputies may deploy the beanbag shotgun when physical contact is too dangerous and lethal force is unreasonable.

**Note: It is NOT to be used on someone refusing to exit a vehicle.**

Authorized use examples:
- A subject armed with a stick, bottle, rock, or similar object who refuses to comply
- A subject threatening self-harm with a knife or blunt object
- Individuals throwing projectiles or acting violently disruptive
- Intoxicated or mentally ill subjects displaying erratic or threatening behavior
- Large aggressive animals posing a threat to deputies or civilians`,
      },
      {
        id: "5-11", number: "5.11", title: "Firearm Discharge Reporting & Exchange",
        content: `Deputies are required to **immediately notify a supervisor** following the discharge of any duty-issued firearm, regardless of injury or damage.

**Required Supervisor Notification:**
- The reason for the firearm discharge
- Whether the deputy believed their life, another deputy's life, or the life of a civilian was at risk
- The number of rounds fired
- The number of rounds believed to be on target

**Post-Discharge Procedure:**
After documentation, the involved deputy shall return to the station and exchange the discharged firearm for a replacement duty firearm.`,
      },
      {
        id: "5-12", number: "5.12", title: "Stolen Law Enforcement Vehicle & Use of Force (Marko West Act)",
        content: `The theft or unlawful possession of a law enforcement patrol vehicle does not, by itself, justify the use of force. Deputies shall not use force against a suspect solely because the vehicle involved is a stolen law enforcement unit.

Use of force against a suspect operating a stolen law enforcement vehicle is **prohibited** unless the vehicle is being actively used as a weapon and presents an immediate and articulable threat of death or serious bodily injury to deputies or the public.`,
      },
    ],
  },
  {
    id: "section-6",
    number: "VI",
    title: "Equipment & Vehicles",
    subsections: [
      {
        id: "6-1", number: "6.1", title: "Authorized Equipment",
        content: `Deputies shall be properly equipped prior to patrol. Only approved departmental equipment may be carried and used. Unauthorized equipment or modifications are prohibited unless specifically approved by the Chain of Command.

**Standard Department-Issued Equipment (On Person):**
- Knife
- Axon Body 4 (optional, if issued)
- Motorola APX8000 Handheld Radio
- Handcuffs (two (2) pairs)

**Patrol Vehicle Equipment:**
- Axon Fleet 3 Dashcam
- Wraith ARS 2X Radar (Front and Rear)
- Automated License Plate Reader (ALPR) System
- Collapsible Traffic Cones (twelve (12))
- Police Barriers (two (2))
- APX 6500 In-Car Radio
- First Aid Kit
- Defibrillator
- Fire Extinguisher
- Body Armor (plate carriers authorized only while wearing the Utility Uniforms)
- Red Hand Flares (four (4))`,
      },
      {
        id: "6-2", number: "6.2", title: "Body-Worn Cameras",
        content: `Body-Worn Cameras (BWC) shall be **mandatory** for all sworn members during the performance of official duties involving public interaction, enforcement actions, or calls for service.

**Deputies shall activate their BWC:**
- Before initiating any law enforcement contact with the public
- During all traffic stops, detentions, arrests, searches, pursuits, and use-of-force incidents
- During any investigative or enforcement-related encounter

**Exemptions (when operational necessity justifies it):**
- Deputies assigned to undercover or covert operations
- Personnel operating within federal or multi-agency task forces

This exemption does **not** apply when personnel are operating within a BCSO or LCSO-marked/unmarked vehicle, or are actively participating in patrol functions.

Deputies shall not disable, tamper with, or intentionally fail to activate BWCs without justification.`,
      },
      {
        id: "6-3", number: "6.3", title: "Firearms",
        content: `**Authorized Firearms:**
- Pistol: Glock Mk II / Glock 19 Gen 4 – Black
- Carbine Rifle: Carbine Rifle Mk II / DDM4v7 11" – Black
- Shotgun: Pump Shotgun Mk II – Regular

**Approved Firearm Modifications:**
- Carbine Rifle: Flashlight, grip, small optic
- Pistol: Flashlight, small optic
- Pump Shotgun: Flashlight

All other firearm modifications are prohibited.`,
      },
      {
        id: "6-4", number: "6.4", title: "Less-Lethal Equipment",
        content: `**Authorized Less-Lethal Equipment:**
- Stun Gun (x26 Taser/Taser 7/10)
- Nightstick (Baton)
- Pump Shotgun - Beanbag
- OC Spray (if equipped in-game)

Less-lethal equipment shall be used only when lawful authority exists and in accordance with the Use of Force policy.`,
      },
      {
        id: "6-5", number: "6.5", title: "Casual Weekends",
        content: `The Casual Weekends policy allows members to utilize relaxed uniforms and approved vehicles on **Fridays, Saturdays, and Sundays**.

Probationary Deputies through Master Deputies may use the Corporal uniform structure without rank chevrons and the Sergeant fleet structure, excluding ghosted and unmarked vehicles. All members remain subject to departmental standards and professional conduct expectations.`,
      },
      {
        id: "6-6", number: "6.6", title: "Patrol Vehicle Structure",
        content: `Deputies shall operate only approved departmental patrol vehicles. All patrol vehicles shall comply with departmental standards for livery, lighting, equipment, and performance.

**Vehicle variant restrictions:**
- Lieutenant+ – Authorized for unmarked variants
- Corporal+ – Authorized for slicktop variants
- Deputy – Authorized for standard marked patrol vehicles only`,
      },
      {
        id: "6-7", number: "6.7", title: "Patrol Uniform Structure",
        content: `All members shall adhere to the approved departmental uniform structure at all times while on duty or representing the department. Uniforms shall be worn as issued and authorized for the member's rank, assignment, and duty status.

Unauthorized alterations, substitutions, or mixing of uniform components are prohibited unless approved by the Chain of Command.`,
      },
      {
        id: "6-8", number: "6.8", title: "ALPR Usage",
        content: `Automated License Plate Readers (ALPRs) are authorized for use in accordance with departmental policy. ALPR systems shall be used for official law enforcement purposes only and in compliance with applicable training and authorization requirements.

Misuse of ALPR systems, unauthorized access, or use outside of approved operational guidelines is prohibited.`,
      },
      {
        id: "6-9", number: "6.9", title: "License Plates",
        content: `**Marked Plate Format:**
- Format: #### (four digits matching the deputy's assigned callsign)
- All marked vehicles shall utilize the BCSO (Black & Yellow) license plate

**Unmarked Plate Format:**
- Format: #LL####
  - First number (#) is random
  - Letters (LL) are random
  - Final four numbers (####) shall match the deputy's assigned callsign
- All unmarked vehicles shall utilize any civilian style plate
- Government plates (BCSO, State, Government) shall NOT be utilized in an unmarked capacity`,
      },
      {
        id: "6-10", number: "6.10", title: "Vehicle Modifications",
        content: `**Prohibited Modifications:**
- Window tint that obstructs visibility of emergency lighting
- Turbo modifications
- Torque multipliers
- Power multipliers

**Allowed Modifications:**
- Window tint that does not obstruct emergency lighting
- Engine modifications
- Armor modifications
- Transmission modifications
- Brake modifications

**Required Modifications:**
- San Andreas Exempt (Government) license plate formatted in accordance with the License Plate Policy`,
      },
    ],
  },
  {
    id: "section-7",
    number: "VII",
    title: "Records, Reporting & CAD",
    subsections: [
      {
        id: "7-1", number: "7.1", title: "Records, Reporting & Introduction",
        content: `This chapter establishes standards for records management, report writing, and use of the Computer-Aided Dispatch (CAD) system. Accurate documentation and proper use of CAD are essential to departmental accountability, transparency, and effective operations.

All members are responsible for maintaining truthful, complete, and timely records for all required incidents and activities.`,
      },
      {
        id: "7-2", number: "7.2", title: "Incident Reports & Records Submission",
        content: `All incident reports and records shall be completed accurately, thoroughly, and in accordance with departmental standards. Required reports must be submitted to the Incident Review channel for administrative review.

**Required Reports:**
- Incident Report
- Crash Report
- DUI Report
- Use of Force Report

**Required Records:**
- Arrest Record
- Search Warrant (must be set as inactive until approved by a judge)
- Arrest Warrant (must be set as inactive until approved by a judge)

**Submission Timeline:**
All required reports and records shall be submitted to the Incident Review channel **within three (3) days** of scene completion.`,
      },
      {
        id: "7-3", number: "7.3", title: "Report Standards",
        content: `Members shall complete required reports for all applicable incidents including arrests, use of force, pursuits, investigations, and significant calls for service.

Reports shall be truthful, clear, complete, and submitted in a timely manner. **Falsifying, omitting, or misrepresenting information in a report is prohibited.**

Supervisory personnel will review reports for accuracy, completeness, and policy compliance.`,
      },
      {
        id: "7-4", number: "7.4", title: "CAD Usage",
        content: `The Computer-Aided Dispatch (CAD) system shall be used by all members to document calls for service, arrests, reports, and patrol activity. Deputies shall accurately update their status, unit assignment, and call activity within CAD.

**Falsifying, omitting, or misrepresenting information in the CAD system is prohibited.** Members shall not access, modify, or view CAD records without a legitimate law enforcement purpose.`,
      },
    ],
  },
  {
    id: "section-8",
    number: "VIII",
    title: "Training & Professional Development",
    subsections: [
      {
        id: "8-1", number: "8.1", title: "Training & Professional Development Introduction",
        content: `Training within the BCSO is overseen by the Deputy Training Advancement Course (DTAC) and is essential to maintaining professionalism and operational readiness. All members are responsible for completing required training and maintaining proficiency in departmental duties.`,
      },
      {
        id: "8-2", number: "8.2", title: "Ride-Alongs",
        content: `Ride-alongs are conducted through DTAC under the oversight of the Professional Standards Bureau (PSB) and provide practical, in-field training and evaluation.

Probationary Deputies and Probationary Reserve members are required to complete all assigned ride-along phases as established by DTAC.

**Failure to complete required ride-alongs within thirty (30) days of hire may result in disciplinary action.**`,
      },
      {
        id: "8-3", number: "8.3", title: "Continuing Education Program",
        content: `The Continuing Education Program provides ongoing and enhanced training to all members. Attending these training sessions will not provide special privilege or ability within patrol but will provide additional knowledge and skills to improve roleplay quality.

**Requirements:**
- Members holding the rank of Deputy+ may attend and become certified in any available training courses
- BCSO Master Deputies certified in the specific training may assist in scheduled training

**Members who hold the rank of BCSO Corporal+ may host training courses if they have:**
- Attended the training course once
- Assisted with instruction of the training course once
- Satisfactorily instructed the training course while being evaluated by a certified Staff in Training+ Member

**Available Training Courses:**
- Basic First Aid Training – Medical emergencies, Narcan administration, life-saving initial treatment
- Case Law Training – Basic United States Case Laws
- Felony Traffic Stops Training – Conducting proper felony traffic stops
- SFST's Training – DUI investigations and Standardized Field Sobriety Tests
- De-escalation & Use of Force Training – Verbal mitigation, legal obligations, compliance techniques`,
      },
    ],
  },
  {
    id: "section-9",
    number: "IX",
    title: "Promotions & Career Progression",
    subsections: [
      {
        id: "9-1", number: "9.1", title: "Promotions & Career Progression Introduction",
        content: `Promotions are based on performance, professionalism, activity, training completion, and departmental needs. Career progression is intended to recognize dedication, demonstrated competence, leadership potential, and consistent service.

The Chain of Command retains final authority over all promotions, rank appointments, and career advancement decisions. Meeting minimum eligibility requirements does **not** guarantee promotion.`,
      },
      {
        id: "9-2", number: "9.2", title: "Promotion Eligibility Requirements",
        content: `**Probationary Deputy Promotion Requirements:**
- Complete a minimum of ten (10) patrol hours
- Serve a minimum of fifteen (15) days with the department
- Successfully complete the FTO Basic Academy
- Successfully complete all required ride-alongs

**Deputy through Master Deputy:**
- Complete a minimum of ten (10) patrol hours per month
- Have no sustained disciplinary actions within the previous thirty (30) days

**Corporal Selection Requirements (via CCP):**
- Must have been with the department for a minimum of sixty (60) days
- Be an active Field Training Officer (FTO)
- Hold the rank of Master Deputy
- Have no disciplinary action within the past sixty (60) days

**Chain of Command (CoC) Promotion Requirements:**
- Complete a minimum of five (5) administrative hours
- Complete a minimum of ten (10) patrol hours
- Be an active Field Training Officer (FTO)
- Have no 10-90s within the past thirty (30) days
- Have no 10-93s within the past thirty (30) days`,
      },
      {
        id: "9-3", number: "9.3", title: "Rank Appointments & Demotions",
        content: `The Chain of Command retains full authority over all rank appointments, promotions, demotions, and removals. Members may be appointed to ranks based on departmental needs, performance, leadership ability, or specialized qualifications.

Demotions may occur due to disciplinary action, failure to meet performance standards, inactivity, or loss of required qualifications.`,
      },
      {
        id: "9-4", number: "9.4", title: "Activity Requirements",
        content: `All members are expected to meet minimum activity requirements to maintain good standing within the department.

**Minimum monthly activity requirements:**
- Full-Time Membership: Minimum of **four (4) hours** per month
- Full-Time Staff in Training+: Minimum of **ten (10) patrol hours** and **five (5) admin hours** per month
- Full-Time Admin: Minimum of **twelve (12) patrol hours** and **three (3) admin hours** per month
- Reserve Membership: Minimum of **two (2) hours** per month`,
      },
      {
        id: "9-5", number: "9.5", title: "Leave of Absence",
        content: `Members who require time away from duty shall submit a Leave of Absence (LOA). All LOAs shall be submitted and documented through the OasisRP website.

All LOAs shall be acknowledged by an Administrator or Main Department Leadership. **An LOA is not considered valid until it has been formally acknowledged.**`,
      },
      {
        id: "9-6", number: "9.6", title: "Transfers In & Out of the Department",
        content: `**Transfer Eligibility Requirements:**
- Serve a minimum of forty-five (45) days with the department
- Have no disciplinary action within the past thirty (30) days
- Have not taken a Leave of Absence (LOA) within the past thirty (30) days
- Have met minimum patrol hour requirements for community membership

All transfer requests shall be reviewed by a final review board consisting of at least one (1) member of Administration.`,
      },
      {
        id: "9-7", number: "9.7", title: "Rank Hinting",
        content: `Rank hinting is **prohibited** within the BCSO. Members shall not attempt to influence, solicit, or imply entitlement to promotion or preferential treatment outside established advancement processes.

Violations of this policy may result in corrective or disciplinary action and removal from promotion consideration.`,
      },
      {
        id: "9-8", number: "9.8", title: "Reserve Entry Requirements",
        content: `To be eligible for appointment as a Reserve Deputy, applicants must currently hold a rank equivalent to Deputy, including Civilian 1, Trooper, Police Officer I, or Firefighter.

Applicants must **not** have an active 10-90 status at the time of submission.

All Reserve applications are reviewed by the Administration Team. The standard review period is up to **seventy-two (72) hours** from the time of submission.`,
      },
    ],
  },
  {
    id: "section-10",
    number: "X",
    title: "Discipline & Accountability",
    subsections: [
      {
        id: "10-1", number: "10.1", title: "Discipline & Accountability Introduction",
        content: `This chapter establishes the standards for discipline and accountability within the BCSO. All members are expected to comply with departmental policies, roleplay standards, and lawful directives. Discipline exists to correct misconduct, maintain professionalism, and ensure fair and consistent enforcement of departmental standards.`,
      },
      {
        id: "10-2", number: "10.2", title: "Disciplinary Authority",
        content: `Disciplinary authority is assigned based on the severity of misconduct and the rank of the issuing authority.

**Disciplinary Issuing Authority:**
- Staff in Training+ – Authorized to issue coaching
- Staff+ – Authorized to issue 10-90s
- Senior Staff+ – Authorized to issue 10-93s
- Junior Administration+ – Authorized to issue demotions and terminations
- Community Leadership – Authorized to issue permanent terminations`,
      },
      {
        id: "10-3", number: "10.3", title: "Disciplinary Action Process",
        content: `**Coaching** – Issued by Staff in Training+. Documented corrective action for minor policy or performance issues. Permanently documented.

**Ride-Along with Chain of Command** – Issued by Staff in Training+. Mandatory ride-along to address professionalism, decision-making, or policy compliance concerns.

**10-90** – Issued by Staff+. A **thirty (30) day hold** on promotions, transfers, and reserve eligibility. Permanently documented.

**10-93** – Issued by Senior Staff+. A **sixty (60) day hold** on promotions, transfers, and reserve eligibility, along with an automatic **twenty-four (24) hour asset suspension** (TeamSpeak, Discord, Patrol Servers). Asset suspension may be extended up to seventy-two (72) hours. Permanently documented.

**Demotion** – Issued by Junior Administration+. Removal of rank within the BCSO.

**Termination** – Issued by Junior Administration+. Termination of membership from OasisRP, loss of patrol privileges, and loss of access to all internal social channels and patrol servers. **Appealable after thirty (30) days.**

**Permanent Termination** – Issued by Community Leadership. Not appealable.`,
      },
      {
        id: "10-4", number: "10.4", title: "Appeals Process",
        content: `**Appealable Disciplinary Actions:**
- 10-90
- 10-93
- Demotion
- Termination

**Non-Appealable Disciplinary Actions:**
- Ride-Along with Chain of Command
- Permanent Termination (unless reviewed and approved by Community Leadership)

Appeals shall be based on procedural errors, factual inaccuracies, or misapplication of policy. Disciplinary actions shall remain in effect while an appeal is under review.

Filing a false, frivolous, or bad-faith appeal may result in additional disciplinary action.`,
      },
      {
        id: "10-5", number: "10.5", title: "Department Awards & Recognition",
        content: `The BCSO maintains a formal awards program to recognize exceptional performance, professionalism, and contribution. All departmental awards shall be formally presented during the official department meeting held at the end of each month.

**Award Categories:**
- **Deputy of the Month** – Selected by the Chain of Command based on overall performance, activity level, and professionalism
- **Reserve Deputy of the Month** – Selected by the Chain of Command based on performance, activity, and contribution to reserve operations
- **Chain of Command Member of the Month** – Selected by department Administration based on leadership performance, activity, and departmental impact
- **Sheriff's Award** – Selected solely by the Sheriff based on outstanding performance, dedication, or exceptional service
- **Media of the Month** – Selected by a department-wide vote recognizing the best screenshot or media submission`,
      },
    ],
  },
  {
    id: "section-11",
    number: "XI",
    title: "Appendices",
    subsections: [
      {
        id: "11-1", number: "11.1", title: "Change Log",
        content: `| Date | Section | Change | Signature |
|------|---------|--------|-----------|
| 02/15/2026 | Entire Document | Initial Release | Bryson R. 3003 |
| 02/21/2026 | Additional Policies | Added BCSO.001 - BCSO.009 | Bryson R. 3003 |
| 02/22/2026 | Training & Professional Development | Added 8.3 Continuing Education Program | Bryson R. 3003 |

**Last Revised:** 04/11/2026 | **Creation Date:** 02/07/2026`,
      },
    ],
  },
  {
    id: "section-add",
    number: "ADD",
    title: "Additional Policies",
    subsections: [
      {
        id: "add-001", number: "BCSO.001", title: "Vehicle Pursuit Policy",
        content: `This policy governs vehicle pursuits conducted by members of the Blaine County Sheriff's Office. All vehicle pursuits shall be initiated and conducted in accordance with departmental policy and community guidelines.

*Full policy document available through departmental channels.*`,
      },
      {
        id: "add-002", number: "BCSO.002", title: "Suspect Detention & Arrest Policy",
        content: `This policy establishes standards for the detention and arrest of suspects by BCSO members. All detentions and arrests shall be conducted lawfully and in accordance with departmental policy.

*Full policy document available through departmental channels.*`,
      },
      {
        id: "add-003", number: "BCSO.003", title: "Supervisor Request & Response Policy",
        content: `This policy governs the process for requesting and responding to supervisor requests during field operations.

*Full policy document available through departmental channels.*`,
      },
      {
        id: "add-004", number: "BCSO.004", title: "Female Suspect Search Policy",
        content: `This policy establishes procedures for conducting searches of female suspects by BCSO members.

*Full policy document available through departmental channels.*`,
      },
      {
        id: "add-005", number: "BCSO.005", title: "Ride-Along Policy",
        content: `This policy governs civilian and inter-departmental ride-alongs with BCSO members.

*Full policy document available through departmental channels.*`,
      },
      {
        id: "add-006", number: "BCSO.006", title: "Cruise Lights Usage Policy",
        content: `This policy governs the authorized use of cruise lights by BCSO members during patrol operations.

*Full policy document available through departmental channels.*`,
      },
      {
        id: "add-007", number: "BCSO.007", title: "DUI Investigations & SFST's Policy",
        content: `This policy establishes procedures for conducting DUI investigations and administering Standardized Field Sobriety Tests.

*Full policy document available through departmental channels.*`,
      },
      {
        id: "add-008", number: "BCSO.008", title: "Unmarked Vehicle Policy",
        content: `This policy governs the use and operation of unmarked vehicles by authorized BCSO members.

*Full policy document available through departmental channels.*`,
      },
      {
        id: "add-009", number: "BCSO.009", title: "Plain Clothes Usage Policy",
        content: `This policy establishes standards for the use of plain clothes attire by authorized BCSO members during official operations.

*Full policy document available through departmental channels.*`,
      },
    ],
  },
];
