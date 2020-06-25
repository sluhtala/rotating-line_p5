function setup()
{
    frameRate(60);
    createCanvas(1000, 1000);
    for(i = 0; i < pnt_amount; i++)
    {
        points.push(new pnt(int(random(-300, 300)), int(random(-300, 300))));
    }
    slider = createSlider(-10, 10, 1, 0.1);
    slider.style("width", "1000px");
    hide_points_button = createCheckbox("Hide points", false);
    midx = width / 2;
    midy = height /2 ;
}

class bigline
{
    constructor(cx, cy)
    {
        this.cx = cx;
        this.cy = cy;
    }
    draw_line(angle)
    {
        stroke(0);
        var x = cos(radians(angle)) * 1500;
        var y = sin(radians(angle)) * 1500;
        line(midx - x + this.cx, midy - y + this.cy, x + midx + this.cx, y + midy + this.cy);   
        
    }
    set_center(cx, cy)
    {
        this.cx = cx;
        this.cy = cy;
    }
}

class pnt
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
    draw_pnt()
    {
        noStroke();
        fill(200,255,200);
        ellipse(this.x + midx, this.y + midy, pnt_r * 1.5, pnt_r * 1.5)
    }
    get_angle(cx, cy)
    {
        if (int(cx) == int(this.x) && int(cy) == int(this.y))
            return (-10000);
        var a = atan((this.y  - cy) / (this.x - cx));
        a = degrees(a);
        if (a < 0)
            a = 180 + a;
        return (a);
    }
    get_distance(cx, cy)
    {
    
        var xd = this.x - cx;
        var yd = this.y - cy;
        var d = sqrt(xd * xd + yd * yd);
        return (d);
    }

}

let midx = 500;
let midy = 500;
var angle = 0;
let speed = 1;
let pnt_amount = 2;
var myLine = new bigline(0, 0);
var points = [];
var pnt_r = 10;
var ofs = 0;
var slider;
var line_direction = 1;
var hide_points_button;

function compare_angles(a1, a2, p)
{
  
    if (int(p.x) == myLine.cx && p.y == myLine.cy)
        return 0;
    
    var lx = cos(radians(angle));
    var ly = sin(radians(angle));
    var n = sqrt(lx * lx + ly * ly);
    lx /= n;
    ly /= n;
   
    var dx = myLine.cx - p.x;
    var dy = myLine.cy - p.y;
    //dot product
    var d = lx * dx + ly * dy;

    if ((lx*d < dx + pnt_r) && (lx*d > dx - pnt_r))
        if ((ly*d < dy + pnt_r ) && ( ly*d > dy - pnt_r))
            return 1;
      return 0;
}



function draw()
{
    angle %= 180;
    ofs %= 180;
    background(100);
    for(i = 0; i < pnt_amount; i++)
       if (hide_points_button.checked() == false)
            points[i].draw_pnt();

    //compare angles

   for (i = 0; i < pnt_amount; i++)
   {
     
       var temp_angle = points[i].get_angle(myLine.cx, myLine.cy);
        if (compare_angles(angle, temp_angle, points[i]))
        {
            var dist = points[i].get_distance(myLine.cx, myLine.cy);
            if (dist > pnt_r)
            {
                myLine.set_center(points[i].x , points[i].y );
                ofs += degrees(atan(pnt_r * 2 / dist) * 1.5);
            }
            break;
        }
    }
    if (speed  < 0)
        angle = (((millis() / 100 * speed)) + ofs * -1);
    else if (speed  > 0)
        angle = (((millis() / 100 * speed)) + ofs);
    speed = (slider.value());
    myLine.draw_line(angle);
}

function mouseClicked()
{
    if (mouseX < 1000 && mouseY < 1000)
    {
        pnt_amount++;
        points.push(new pnt(mouseX-midx, mouseY- midy));
        print(points[pnt_amount - 1].get_distance(myLine.cx, myLine.cy));
    }
}
