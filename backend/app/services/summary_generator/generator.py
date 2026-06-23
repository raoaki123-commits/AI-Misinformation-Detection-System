"""Analyst summary generator for SENTINEL"""
from typing import Dict, List


def generate_summary(
    verdict: str,
    scores: Dict,
    propaganda_result: Dict,
    evidence_result: Dict,
    narrative_result: Dict,
    top_claims: List[Dict],
) -> str:
    cred = scores["credibility"]
    manip = scores["manipulation"]
    prop = scores["propaganda"]
    evid = scores["evidence"]
    ev_map = evidence_result["evidence_map"]
    markers = propaganda_result["markers"]

    # Opening line based on verdict
    if verdict == "Likely Reliable":
        opening = "This content demonstrates reasonable evidential standards and does not exhibit significant markers of manipulation or propaganda."
    elif verdict == "Mixed / Unverified":
        opening = "This content presents mixed credibility signals. Some factual assertions appear credible, while others lack verification or attributable sources."
    elif verdict == "Propaganda-Heavy":
        opening = f"This content exhibits strong propaganda characteristics, scoring {prop:.0f}/100 on the propaganda index. The rhetorical structure is designed to persuade rather than inform."
    elif verdict == "Emotionally Manipulative":
        opening = f"This content is assessed as primarily emotionally manipulative, with a manipulation index of {manip:.0f}/100. It prioritizes emotional escalation over substantive evidence."
    elif verdict == "High-Risk Misinformation":
        opening = f"SENTINEL has flagged this content as high-risk. The credibility score of {cred:.0f}/100 reflects a combination of weak evidence, high emotional manipulation, and significant propaganda signals."
    else:
        opening = f"This content displays several credibility concerns, receiving a credibility score of {cred:.0f}/100. Analysis indicates misleading narrative framing with insufficient evidentiary support."

    # Evidence assessment
    if ev_map["named_sources"] == 0 and ev_map["citation_like_references"] == 0:
        evidence_line = "No named or verifiable sources were identified. The content relies on assertion rather than attribution, a significant credibility deficit."
    elif ev_map["named_sources"] < 2:
        evidence_line = f"Evidence quality is assessed as {ev_map['evidence_quality'].lower()}. Only {ev_map['named_sources']} named source(s) were detected, with {ev_map['anonymous_claims']} anonymous references and {ev_map['unsupported_assertions']} unsupported assertions."
    else:
        evidence_line = f"The content provides {ev_map['named_sources']} named source(s) and {ev_map['statistics_references']} statistical reference(s), yielding an evidence quality rating of {ev_map['evidence_quality'].lower()}."

    # Propaganda / manipulation line
    if markers:
        top_2 = [m["description"] for m in markers[:2]]
        prop_line = f"Primary rhetorical patterns detected: {', '.join(top_2)}. These are common techniques in content designed to bypass critical thinking and accelerate emotional acceptance."
    else:
        prop_line = "No significant propaganda patterns were identified in the rhetorical structure."

    # Narrative line
    narrative_line = f"Dominant narrative framing: {narrative_result.get('primary', 'Undetermined')}. {narrative_result.get('explanation', '')}"

    # Recommendation
    if cred < 40:
        rec = "SENTINEL recommends treating this content with significant caution. Cross-reference claims with primary sources and established fact-checking resources before sharing or acting on this information."
    elif cred < 65:
        rec = "SENTINEL recommends exercising caution. Key claims should be independently verified before treating as reliable."
    else:
        rec = "While no major red flags are present, standard source verification practices are recommended before treating content as fully authoritative."

    return " ".join([opening, evidence_line, prop_line, narrative_line, rec])
