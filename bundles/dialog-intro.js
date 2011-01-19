{
    addImage: [
        ["intro", "resources/intro.png"]
    ],

    setObject: [
		{
		    object: "intro_dialogue",
		    property: "intro",
		    value: {
		        font: "small",
		        skipkey: "a",
		        esckey: "b",
		        who: {
		            narrator: {
		                x: 10,
		                y: 150
		            }
		        },
		        scenes: [
		  			{
		  			    slide: {
		  			        image: "intro",
		  			        x: 0,
		  			        y: 40
		  			    },
		  			    speed: 1,
		  			    who: "narrator",
		  			    audio: "beep",
		  			    talk: [
		  					"Lalala... mythical puzzle game..."
		  				]
		  			}
		  		]
		    }
		}
	]
}
