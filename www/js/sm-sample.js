// JavaScript Document

function user_sel(sltd) {
	$("#home_user tr td").removeClass("active");
	$("#home_user tr td:nth-child("+sltd+")").addClass("active");
}
function mot_sel(sltd) {
	$("#home_mot tr td").removeClass("active");
	$("#home_mot tr td:nth-child("+sltd+")").addClass("active");
}
function map_sel(sltd) {
	$("#home_map tr td").removeClass("active");
	$("#home_map tr td:nth-child("+sltd+")").addClass("active");
}

function pro_priv_toggle(sltd) {
	abtn = $(".pro_priv_top tr td button.item"+sltd);
	abtn.toggleClass("hide");
	settohide = abtn.hasClass('hide');
	if (settohide) { abtn.text("HIDE"); } else { abtn.text("SHOW"); }
}

function remove_loc(sltd) {
	$(".pro_pub_locations.private tr:nth-child("+sltd+")").toggle();
}


