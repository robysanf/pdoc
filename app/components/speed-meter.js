import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['speed-meter'],
    layoutName: 'components/speed-meter',
    control_target: null,
    control_width: 300,
    control_height: 100,
    control_speed: null,
    rateSize: 100,

    //iCurrentSpeed:50,
    iTargetSpeed:50,
    //bDecrement:null,
    job:null,

    setup: function() {
        if(this.get('target')) {
            this.set('control_target', this.get('target'));
        }
        if(this.get('speed')) {
            this.set('control_speed', this.get('speed'));
        }
        if(this.get('custom_width')) {
            this.set('control_width', this.get('custom_width'));
        }
        if(this.get('custom_height')) {
            this.set('control_height', this.get('custom_height'));
        }
        if(this.get('rateSize')) {
            this.set('rateSize', this.get('rateSize'));
        }

        this.draw(this.control_speed, this.control_target); //MAX control_speed 100

    }.on('didInsertElement'),

    degToRad:function(angle)
    {
        // Degrees to radians
        return ((angle * Math.PI) / 180);
    },

    radToDeg:function(angle)
    {
        // Radians to degree
        return ((angle * 180) / Math.PI);
    },

    createLine:function(fromX, fromY, toX, toY, fillStyle, lineWidth, alpha)
    {
        // Create a line object using Javascript object notation
        return {
            from: {
                X: fromX,
                Y: fromY
            },
            to:	{
                X: toX,
                Y: toY
            },
            fillStyle: fillStyle,
            lineWidth: lineWidth,
            alpha: alpha
        };
    },


    drawLine:function(options, line)
    {
        // Draw a line using the line object passed in
        options.ctx.beginPath();

        // Set attributes of open
        options.ctx.globalAlpha = line.alpha;
        options.ctx.lineWidth = line.lineWidth;
        options.ctx.fillStyle = line.fillStyle;
        options.ctx.strokeStyle = line.fillStyle;
        options.ctx.moveTo(line.from.X, line.from.Y);

        // Plot the line
        options.ctx.lineTo(
            line.to.X,
            line.to.Y
        );

        options.ctx.stroke();
    },

    drawBackground:function(options)
    {
        /* Black background with alphs transparency to
         * blend the edges of the metallic edge and
         * black background
         */

        //background-color: rgba(245, 245, 245, 0.4); border: 0px

        options.ctx.globalAlpha = 0.6;
        options.ctx.fillStyle = "rgba(245, 245, 245, 0.9); border: 0px";

        var i = (170 / 100) * Number(this.rateSize),
            i_max = (180 / 100) * Number(this.rateSize);


        // Draw semi-transparent circles
        for (i ; i < i_max ; i++)     // (var i = 170; i < 180 ; i++)
        {
            options.ctx.beginPath();

            options.ctx.arc(options.center.X,
                options.center.Y,
                    1 * i, 0,
                Math.PI,
                true);

            options.ctx.fill();
        }
    },


    drawSpeedometerColourArc: function (options)
    {
        /* Draws the colour arc.  Three different colours
         * used here; thus, same arc drawn 3 times with
         * different colours.
         * TODO: Gradient possible?
         */

        var delta = (180/6);

        var startOfRed = delta;
        var startOfYellow = 180;
        var startOfGreen = 270 - delta;
        var endOfGreen = 300 + delta;

        this.drawSpeedometerPart(options, 1.0, "rgb(255, 0, 0)", startOfRed, startOfYellow);
        this.drawSpeedometerPart(options, 0.9, "rgb(255, 255, 0)", startOfYellow, startOfGreen);
        this.drawSpeedometerPart(options, 0.9, "rgb(82, 240, 55)", startOfGreen, endOfGreen);

    },

    drawSpeedometerPart: function (options, alphaValue, strokeStyle, startPos, endPos) {
        /* Draw part of the arc that represents
         * the colour speedometer arc
         */

        if(endPos == null) {
            endPos = 0 - (Math.PI / 360 * 10);
        }

        options.ctx.beginPath();

        options.ctx.globalAlpha = alphaValue;
        options.ctx.lineWidth = 5;
        options.ctx.strokeStyle = strokeStyle;

        options.ctx.arc(options.center.X,                               //The x-coordinate of the center of the circle
            options.center.Y,                                           //The y-coordinate of the center of the circle
            options.levelRadius,                                        //The radius of the circle
                Math.PI + (Math.PI / 360 * startPos),                   //The starting angle, in radians
                Math.PI + (Math.PI / 360 * endPos),                     //The ending angle, in radians
            false);

        options.ctx.stroke();
    },


    applyDefaultContextSettings:function(options)
    {
        /* Helper function to revert to gauges
         * default settings
         */

        options.ctx.lineWidth = 2;
        options.ctx.globalAlpha = 0.5;
        options.ctx.strokeStyle = "rgb(255, 255, 255)";
        options.ctx.fillStyle = 'rgb(255,255,255)';
    },


    drawLargeTickMarks:function(options)
    {
        /* The small tick marks against the coloured
         * arc drawn every 5 mph from 10 degrees to
         * 170 degrees.
         */

        var tickvalue = options.levelRadius - 8;
        var iTick = 0;
        var gaugeOptions = options.gaugeOptions;
        var iTickRad = 0;
        var delta = 180/6;

        this.applyDefaultContextSettings(options);

        // Tick every 20 degrees (small ticks)
        for (iTick = delta/2; iTick < 180; iTick += delta)
        {
            iTickRad = this.degToRad(iTick);

            var onArchX = gaugeOptions.radius - (Math.cos(iTickRad) * tickvalue);
            var onArchY = gaugeOptions.radius - (Math.sin(iTickRad) * tickvalue);
            var innerTickX = gaugeOptions.radius - (Math.cos(iTickRad) * gaugeOptions.radius);
            var innerTickY = gaugeOptions.radius - (Math.sin(iTickRad) * gaugeOptions.radius);

            var fromX = (options.center.X - gaugeOptions.radius) + onArchX;
            var fromY = (gaugeOptions.center.Y - gaugeOptions.radius) + onArchY;

            var toX = (options.center.X - gaugeOptions.radius) + innerTickX;
            var toY = (gaugeOptions.center.Y - gaugeOptions.radius) + innerTickY;

            // Create a line expressed in JSON
            //var line = this.createLine(fromX, fromY, toX, toY, "rgb(127,127,127)", 3, 0.6);
            var line;
            if( this.rateSize <= 60 ){
                line = this.createLine(fromX, fromY, toX, toY, "rgba(0, 0, 0, 0.8)", 1, 0.6);
            } else {
                line = this.createLine(fromX, fromY, toX, toY, "rgba(0, 0, 0, 0.8)", 2, 0.6);
            }

            // Draw the line
            this.drawLine(options, line);

        }
    },

    drawSmallTickMarks:function(options)
    {
        /* The large tick marks against the coloured
         * arc drawn every 10 mph from 10 degrees to
         * 170 degrees.
         */

        var tickvalue = options.levelRadius - 8;
        var iTick = 0;
        var gaugeOptions = options.gaugeOptions;
        var iTickRad = 0;

        var innerTickY;
        var innerTickX;
        var onArchX;
        var onArchY;

        var fromX;
        var fromY;

        var toX;
        var toY;
        var line;

        var delta = 180/6;

        this.applyDefaultContextSettings(options);

        //tickvalue = options.levelRadius - 2;
        tickvalue = options.levelRadius + 2;

        // 10 units (major ticks)
        for (iTick = delta; iTick < 180; iTick += delta)
        {
            iTickRad = this.degToRad(iTick);

            /* Calculate the X and Y of both ends of the
             * line I need to draw at angle represented at Tick.
             * The aim is to draw the a line starting on the
             * coloured arc and continueing towards the outer edge
             * in the direction from the center of the gauge.
             */

            onArchX = gaugeOptions.radius - (Math.cos(iTickRad) * tickvalue);
            onArchY = gaugeOptions.radius - (Math.sin(iTickRad) * tickvalue);
            innerTickX = gaugeOptions.radius - (Math.cos(iTickRad) * gaugeOptions.radius);
            innerTickY = gaugeOptions.radius - (Math.sin(iTickRad) * gaugeOptions.radius);

            fromX = (options.center.X - gaugeOptions.radius) + onArchX;
            fromY = (gaugeOptions.center.Y - gaugeOptions.radius) + onArchY;

            toX = (options.center.X - gaugeOptions.radius) + innerTickX;
            toY = (gaugeOptions.center.Y - gaugeOptions.radius) + innerTickY;

            // Create a line expressed in JSON
            //line =  this.createLine(fromX, fromY, toX, toY, "rgb(127,127,127)", 3, 0.6);
            line = this.createLine(fromX, fromY, toX, toY, "rgba(0, 0, 0, 0.8)", 1, 0.6);

            // Draw the line
            this.drawLine(options, line);
        }
    },

    drawTicks:function(options)
    {
        /* Two tick in the coloured arc!
         * Small ticks every 5
         * Large ticks every 10
         */

        this.drawSmallTickMarks(options);
        this.drawLargeTickMarks(options);
    },


    drawTextMarkers:function(options)
    {
        /* The text labels marks above the coloured
         * arc drawn every 10 mph from 10 degrees to
         * 170 degrees.
         */

        var innerTickX = 0;
        var innerTickY = 0;
        var iTick = 0;
        var iTickToPrint = 0;

        /*queste 3 non c'erano*/
        var gaugeOptions = options.gaugeOptions;
        var deltaRadius = (gaugeOptions.radius/10); // 10
        var radius = gaugeOptions.radius +deltaRadius ;

        var delta = 180/6;

        this.applyDefaultContextSettings(options);

        // Font styling
        //options.ctx.font = 'italic 11px sans-serif';

        if( this.rateSize <= 60 ){
            options.ctx.font = 'bold 8px digital';
        } else {
            options.ctx.font = 'bold 12px digital';
        }

        options.ctx.textBaseline = 'top';
        options.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";

        options.ctx.beginPath();

        // Tick every 20 (small ticks)
        for (iTick = delta/2; iTick <= 180; iTick += delta)
        {
//            innerTickX = gaugeOptions.radius - (Math.cos(this.degToRad(iTick)) * gaugeOptions.radius);
//            innerTickY = gaugeOptions.radius - (Math.sin(this.degToRad(iTick)) * gaugeOptions.radius);

            innerTickX = radius - (Math.cos(this.degToRad(iTick)) * radius);
            innerTickY = radius - (Math.sin(this.degToRad(iTick)) * radius);


            options.ctx.fillText(iTickToPrint, (options.center.X - radius - (deltaRadius/2) ) + innerTickX ,
                    (gaugeOptions.center.Y - radius - deltaRadius ) + innerTickY );


//            // Some cludging to center the values (TODO: Improve)
//            if(iTick )       {
//                options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX,
//                        (gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY + 5);
//            }
//            if(iTick < 50)
//            {
//                options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX - 5,
//                        (gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY + 5);
//            }
//            else if(iTick < 90)
//            {
//                options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX,
//                        (gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY );
//            }
//            else if(iTick === 90)
//            {
//                options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX + 4,
//                        (gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY );
//            }
//            else if(iTick < 145)
//            {
//                options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX + 10,
//                        (gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY );
//            }
//            else
//            {
//                options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX + 15,
//                        (gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY + 5);
//            }

            // MPH increase by 10 every 20 degrees
            iTickToPrint += 20;
        }

        options.ctx.stroke();

    },



    drawNeedleDial:function(options, alphaValue, strokeStyle, fillStyle)
    {
        /* Draws the metallic dial that covers the base of the
         * needle.
         */

        options.ctx.globalAlpha = alphaValue;
        options.ctx.lineWidth = 1;
        options.ctx.strokeStyle = strokeStyle;
        options.ctx.fillStyle = fillStyle;

        var dimCircle = (50 / 100) * Number(this.rateSize);

        // Draw several transparent circles with alpha
        for (var i = 0;i < dimCircle; i++)
        {
            options.ctx.beginPath();

            options.ctx.arc(options.center.X,
                options.center.Y,
                    1*i,
                0,
                Math.PI,
                true);

            options.ctx.fill();

            options.ctx.stroke();
        }
    },





    //
//
//    function convertSpeedToAngle(options) {
//    /* Helper function to convert a speed to the
//     * equivelant angle.
//     */
//    var iSpeed = (options.speed / 10),
//        iSpeedAsAngle = ((iSpeed * 20) + 10) % 180;
//
//    // Ensure the angle is within range
//    if (iSpeedAsAngle > 180) {
//        iSpeedAsAngle = iSpeedAsAngle - 180;
//    } else if (iSpeedAsAngle < 0) {
//        iSpeedAsAngle = iSpeedAsAngle + 180;
//    }
//
//    return iSpeedAsAngle;
//}
//
    convertSpeedToAngle:function(options)
    {
        /* Helper function to convert a speed to the
         * equivalent angle.
         */
        var delta = 180/6;
        var iSpeed = (options.speed),   //(options.speed / 10)
            iSpeedAsAngle = ((iSpeed * delta/20) + delta/2) % 180;


        // Ensure the angle is within range
        if (iSpeedAsAngle > 180) {
            iSpeedAsAngle = iSpeedAsAngle - 180;
        } else if (iSpeedAsAngle < 0) {
            iSpeedAsAngle = iSpeedAsAngle + 180;
        }

        return iSpeedAsAngle;
    },


    //function drawNeedle(options) {

//    var iSpeedAsAngle = convertSpeedToAngle(options),
//        iSpeedAsAngleRad = degToRad(iSpeedAsAngle),
//        gaugeOptions = options.gaugeOptions,
//        innerTickX = gaugeOptions.radius - (Math.cos(iSpeedAsAngleRad) * 20),
//        innerTickY = gaugeOptions.radius - (Math.sin(iSpeedAsAngleRad) * 20),
//        fromX = (options.center.X - gaugeOptions.radius) + innerTickX,
//        fromY = (gaugeOptions.center.Y - gaugeOptions.radius) + innerTickY,
//        endNeedleX = gaugeOptions.radius - (Math.cos(iSpeedAsAngleRad) * gaugeOptions.radius),
//        endNeedleY = gaugeOptions.radius - (Math.sin(iSpeedAsAngleRad) * gaugeOptions.radius),
//        toX = (options.center.X - gaugeOptions.radius) + endNeedleX,
//        toY = (gaugeOptions.center.Y - gaugeOptions.radius) + endNeedleY,
//        line = createLine(fromX, fromY, toX, toY, "rgb(255,0,0)", 5, 0.6);
//
//    drawLine(options, line);
//
//    // Two circle to draw the dial at the base (give its a nice effect?)
//    drawNeedleDial(options, 0.6, "rgb(127, 127, 127)", "rgb(255,255,255)");
//    drawNeedleDial(options, 0.2, "rgb(127, 127, 127)", "rgb(127,127,127)");
//
//}

    drawNeedle:function(options)
    {
        /* Draw the needle in a nice read colour at the
         * angle that represents the options.speed value.
         */

        var iSpeedAsAngle = this.convertSpeedToAngle(options);
        var iSpeedAsAngleRad = this.degToRad(iSpeedAsAngle);

        var gaugeOptions = options.gaugeOptions;

        var innerTickX = gaugeOptions.radius - (Math.cos(iSpeedAsAngleRad) * 20);
        var innerTickY = gaugeOptions.radius - (Math.sin(iSpeedAsAngleRad) * 20);

        var fromX = (options.center.X - gaugeOptions.radius) + innerTickX;
        var fromY = (gaugeOptions.center.Y - gaugeOptions.radius) + innerTickY;

        var endNeedleX = gaugeOptions.radius - (Math.cos(iSpeedAsAngleRad) * gaugeOptions.radius);
        var endNeedleY = gaugeOptions.radius - (Math.sin(iSpeedAsAngleRad) * gaugeOptions.radius);

        var toX = (options.center.X - gaugeOptions.radius) + endNeedleX;
        var toY = (gaugeOptions.center.Y - gaugeOptions.radius) + endNeedleY;

        this.createPolygon(options, fromX, fromY, toX, toY, iSpeedAsAngle);

        // Two circle to draw the dial at the base (give its a nice effect?)
        this.drawNeedleDial(options, 0.6, "rgba(114, 124, 128, 0.8)", "rgba(114, 124, 128, 0.8)");
        //this.drawNeedleDial(options, 0.2, "rgb(127, 127, 127)", "rgb(127,127,127)");

    },

    //x1    y1    x2   y2
    createPolygon:function(options, fromX, fromY, toX, toY, angle)
    {
        var value = 10/angle +1;
        if( this.rateSize >= 60 && angle > 30 && angle <= 120  ){
            value = value + 1;
        }

        var m = ( fromX - toX ) / ( toY - fromY );
        //var q = (( fromY * toX ) - ( toY * fromX )) / ( toX - fromX);

        var q_luca = -m * fromX + fromY;
        var y_minus = m * (fromX -value) + q_luca;
        var y_plus =  m * (fromX +value) + q_luca;

        //var m_luc = -183/49, q_luc = 1410.73;

        options.ctx.fillStyle = '#f00';
        options.ctx.beginPath();
        options.ctx.moveTo(fromX - value, y_minus);
        options.ctx.lineTo(toX,toY);
        options.ctx.lineTo(fromX + value, y_plus);
        options.ctx.closePath();
        options.ctx.fill();
    },


    buildOptionsAsJSON:function(canvas, iSpeed)
    {
        /* Setting for the speedometer
         * Alter these to modify its look and feel
         */

        var centerX = (210/100)* Number(this.rateSize),
            centerY = (210/100)* Number(this.rateSize),
            radius = (140/100)* Number(this.rateSize),
            outerRadius = (200/100)* Number(this.rateSize);

        // Create a speedometer object using Javascript object notation
        return {
            ctx: canvas.getContext('2d'),
            speed: iSpeed,
            center:	{
                X: centerX,
                Y: centerY
            },
            levelRadius: radius - 10,
            gaugeOptions: {
                center:	{
                    X: centerX,
                    Y: centerY
                },
                radius: radius
            },
            radius: outerRadius
        };
    },


    clearCanvas:function(options)
    {
        options.ctx.clearRect(0, 0, 800, 600);
        this.applyDefaultContextSettings(options);
    },

//    MAIN


    draw:function(iSpeed, target)
    {
        /* Main entry point for drawing the speedometer
         * If canvas is not support alert the user.
         */

        var canvas = document.getElementById(target);

        // Canvas good?
        if (canvas != null && canvas.getContext)
        {
            var options = this.buildOptionsAsJSON(canvas, iSpeed);

            // Clear canvas
            this.clearCanvas(options);

            // Draw the metallic styled edge
            //this.drawMetallicArc(options);

            // Draw thw background
            this.drawBackground(options);

            // Draw tick marks
            this.drawTicks(options);

            // Draw labels on markers
            this.drawTextMarkers(options);

            // Draw speeometer colour arc
            this.drawSpeedometerColourArc(options);

            // Draw the needle and base
            this.drawNeedle(options);

        }
        else
        {
            console.log("Canvas not supported by your browser!");
        }
    },


    drawWithInputValue:function()
    {

        var txtSpeed = document.getElementById('txtSpeed');

        if (txtSpeed !== null) {

            this.iTargetSpeed = txtSpeed.value;

            // Sanity checks
            if (isNaN(this.iTargetSpeed)) {
                this.iTargetSpeed = 0;
            } else if (this.iTargetSpeed < 0) {
                this.iTargetSpeed = 0;
            } else if (this.iTargetSpeed > 80) {
                this.iTargetSpeed = 80;
            }

            this.job = setTimeout("draw()", 5);

        }
    }
});
