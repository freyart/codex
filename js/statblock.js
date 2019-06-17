function UpdateStatblock(){
    $.getJSON('src/stats.json')
    .fail(function() {
        console.error('Fichier de stats non disponible.');
    })
    .done(function(data) {
        $.each(data.monsters, function(i, item)
        {
            $('#bestiaire').append(GenererFiche(data.monsters[i]));   
        });
    })
}

function GenererFiche(leMonstre) {
    $statblock = $('<div></div>').addClass('stat-block');
    $statblock.append(GenererHead(leMonstre));
    $statblock.append(AjouterSeparateur());
    $statblock.append(GenererTopStats(leMonstre));
    $statblock.append(AjouterSeparateur());
    GenererTraits(leMonstre['section-traits'], $statblock);
    if(leMonstre['section-actions'].length > 0) {
        $bloc = $('<div>').addClass('actions');
        $bloc.append($('<h3>').append('Actions'));
        GenererTraits(leMonstre['section-actions'], $bloc);
        $statblock.append($bloc);
    }
    if(leMonstre['section-reactions'].length > 0) {
        $bloc = $('<div>').addClass('actions');
        $bloc.append($('<h3>').append('Reactions'));
        GenererTraits(leMonstre['section-reactions'], $bloc);
        $statblock.append($bloc);
    }
    if(leMonstre['legendary-actions'].length > 0) {
        $bloc = $('<div>').addClass('actions');
        $bloc.append($('<h3>').append('Legendary Actions'));
        GenererTraits(leMonstre['legendary-actions'], $bloc);
        $statblock.append($bloc);
    }
    return $statblock;
}

function GenererHead(leMonstre){
    $heading = $('<div></div>').addClass('creature-heading');
    $heading.append($('<h1></h1>').append(leMonstre.name));
    $heading.append($('<h2></h2>').append(leMonstre.keywords));
    return $heading;
}

function GenererTopStats(leMonstre){
    $content = $('<div>').addClass('top-stats');
    $properties = $('<div>').addClass('properties');
    AddPropIfAny("Armor Class", leMonstre.armor, $properties);
    AddPropIfAny("Hit Points", leMonstre.hp, $properties);
    AddPropIfAny("Speed", leMonstre.speed, $properties);
    $content.append($properties);   
    $content.append(AjouterSeparateur());
    $content.append(GenererAbilities(leMonstre));
    $content.append(AjouterSeparateur());
    $properties = $('<div>').addClass('properties');
    AddPropIfAny("Saving Throws", leMonstre.saves, $properties);
    AddPropIfAny("Skills", leMonstre.skills, $properties);
    AddPropIfAny("Damage Immunities", leMonstre['dam-immunities'], $properties);
    AddPropIfAny("Condition Immunities", leMonstre['cond-immunities'], $properties);
    AddPropIfAny("Senses", leMonstre.senses, $properties);
    AddPropIfAny("Languages", leMonstre.languages, $properties);
    AddPropIfAny("Challenge", leMonstre.challenge, $properties);
    $content.append($properties);
    return $content;
}

function AddPropIfAny(titre, prop, cible){
    if(prop !== ""){
        $prop = $('<div>').addClass('property-line')
        .append($('<h4>').append(titre))
        .append(' ')
        .append($('<p>').append(prop));
        cible.append($prop);
    }
}

function GenererAbilities(leMonstre){
    $abilities = $('<div></div>').addClass('abilities');
    $stat = $('<div></div>').addClass('ability-strength');
    $stat.append('<h4>STR</h4>');
    $stat.append($('<p>').append( leMonstre.str + ' (' + GetModifier(leMonstre.str) + ')'));
    $abilities.append($stat);

    $stat = $('<div></div>').addClass('ability-dexterity');
    $stat.append('<h4>DEX</h4>');
    $stat.append($('<p>').append( leMonstre.dex + ' (' + GetModifier(leMonstre.dex) + ')'));
    $abilities.append($stat);

    $stat = $('<div></div>').addClass('ability-constitution');
    $stat.append('<h4>CON</h4>');
    $stat.append($('<p>').append( leMonstre.con + ' (' + GetModifier(leMonstre.con) + ')'));
    $abilities.append($stat);

    $stat = $('<div></div>').addClass('ability-intelligence');
    $stat.append('<h4>INT</h4>');
    $stat.append($('<p>').append( leMonstre.int + ' (' + GetModifier(leMonstre.int) + ')'));
    $abilities.append($stat);

    $stat = $('<div></div>').addClass('ability-wisdom');
    $stat.append('<h4>WIS</h4>');
    $stat.append($('<p>').append( leMonstre.wis + ' (' + GetModifier(leMonstre.wis) + ')'));
    $abilities.append($stat);

    $stat = $('<div></div>').addClass('ability-charisma');
    $stat.append('<h4>CHA</h4>');
    $stat.append($('<p>').append( leMonstre.cha + ' (' + GetModifier(leMonstre.cha) + ')'));
    $abilities.append($stat);
    return $abilities;
}

function GenererTraits(listeTraits, cible){
    listeTraits.forEach(c => {
        
        $section = $('<div></div>').addClass('property-block');
        $section.append($('<h4></h4>').append(c.label).append('. '));
        $section.append($('<p>').append(DecoProp(c.deco)).append(c.desc));
        cible.append($section);
    });
}

function DecoProp(deco){
    if (deco !== ""){
        return $('<i>').append(deco).append(' ');
    }
}

function AjouterSeparateur(){
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
        polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')

    $poly = $(polyline).attr('points','0,0 400,2.5 0,5');
    $(svg).addClass('tapered-rule').attr('height','5').attr('width','100%').append($poly);

    return $(svg);
}

function GetModifier(stat) {
    return PlusMinus(Math.floor((stat-10)/2));
}

function PlusMinus(nombre) {
    if (nombre < 0)
        return nombre;
    else
        return '+' + nombre;
}