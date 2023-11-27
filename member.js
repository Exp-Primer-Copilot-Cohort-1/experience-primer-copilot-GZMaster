function skillsMember() {
    var member = document.getElementById("member");
    var memberSkills = document.getElementById("member-skills");
    var memberSkillsBtn = document.getElementById("member-skills-btn");
    var memberSkillsClose = document.getElementById("member-skills-close");

    memberSkillsBtn.onclick = function() {
        memberSkills.style.display = "block";
        member.style.display = "none";
    }

    memberSkillsClose.onclick = function() {
        memberSkills.style.display = "none";
        member.style.display = "block";
    }
}
