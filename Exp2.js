const jsPsych = initJsPsych({
    /* auto_update_progress_bar: true,
     extensions: {
       type: naodao,
     }*/
     on_finish: function() {
      jsPsych.data.get().localSave('csv', 'exp1_' + info["ID"] + '.csv'); 
      document.exitFullscreen(); 
      let bodyNode = document.getElementsByTagName("body"); 
            }
     });
  
  
  
  var timeline = [] 
  
  
  
  
  var images = ['img/C_ambi40.png', 
  'img/S_ambi40.png', 
  'img/H_ambi40.png']; 

  var preload = {
    type: jsPsychPreload,
    images: [
      'img/C_ambi40.png', 
'img/S_ambi40.png', 
'img/H_ambi40.png'
    ],
  }
timeline.push(preload);


var welcome = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
     <p>您好，欢迎参加本次实验。</p>
     <p>为充分保障您的权利，请确保您已经知晓并同意《参与实验同意书》以及《数据公开知情同意书》。</p>
     <p>如果您未见过上述内容，请咨询实验员。</p>
     <p>如果您选择继续实验，则表示您已经清楚两份知情同意书的内容并同意。</p>
     <p> <div style = "color: green"><按任意键至下页></div> </p>
     `,
    choices: "ALL_KEYS",
  };
  timeline.push(welcome);
  
  var basic_information = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
     <p>本实验首先需要您填写一些基本个人信息。</p>
     <p> <div style = "color: green"><按任意键至下页></div></p>
     `,
    choices: "ALL_KEYS",
  };
  timeline.push(basic_information);

  var info = []
  
  /* basic data collection jsPsychInstructions trial 被试基本信息收集 */
  var information = {
    timeline: [{
    // 实验被试信息收集
    type: jsPsychCallFunction, //探测被试显示器数据
    func: function () {
      if ($(window).outerHeight() < 500) {
        alert("您设备不支持实验，请进入全屏模式。若已进入全屏，请换一台高分辨率的设备，谢谢。");
        window.location = "";
      }
    }
  }, {
    type: jsPsychSurveyHtmlForm,
    preamble: "<p style =' color : white'>您的实验编号是</p>",
    html: function () {
      let data = localStorage.getItem(info["subj_idx"]) ? JSON.parse(localStorage.getItem(info["subj_idx"]))["Name"] : "";
      return "<p><input name='Q0' type='text' value='" + data + "' required/></p>";
    },
    button_label: "继续",
    on_finish: function (data) {    
      info["ID"] = data.response.Q0;
      word = permutation(texts, 3) //对应的文字
        texts = word[parseInt(info["ID"]) % 6] //被试id除以6，求余数
        key = permutation(key, 2)[parseInt(info["ID"]) % 2] //对应的按键
  
        view_texts_images = [] //指导语中呈现的图片和文字对应关系
        jsPsych.randomization.shuffle(images).forEach((v, i) => { //将image随机
          view_texts_images.push(`<img src="${v}" width=150 style="vertical-align:middle">---${texts[images.indexOf(v)]}`); //image编号和文字对应
        })
        console.log(`match : ${key[0]}; \nmismatch : ${key[1]};`)
        console.log(images);
        console.log(texts);
      }
  
    }
  ,{
    type: jsPsychHtmlButtonResponse,
    stimulus: "<p style = 'color : white'>您的性别</p>",
    choices: ['男', '女', '其他'],
    on_finish: function (data) {
      info["Sex"] = data.response == 0 ? "Male" : (data.response == 1 ? "Female" : "Other")
    }
  }, {
    type: jsPsychSurveyHtmlForm,
    preamble: "<p style = 'color : white'>您的出生年</p>",
    html: function () {
      let data = localStorage.getItem(info["subj_idx"]) ? JSON.parse(localStorage.getItem(info["subj_idx"]))["BirthYear"] : "";
      return `<p>
        <input name="Q0" type="number" value=${data} placeholder="1900~2023" min=1900 max=2023 oninput="if(value.length>4) value=value.slice(0,4)" required />
        </p>`
    },
    button_label: '继续',
    on_finish: function (data) {
      info["BirthYear"] = data.response.Q0;
    }
  }, {
    type: jsPsychSurveyHtmlForm,
    preamble: "<p style = 'color : white'>您的教育经历是</p>",
    html: function () {
      return `
                <p><select name="Q0" size=10>
                <option value=1>小学以下</option>
                <option value=2>小学</option>
                <option value=3>初中</option>
                <option value=4>高中</option>
                <option value=5>大学</option>
                <option value=6>硕士</option>
                <option value=7>博士</option>
                <option value=8>其他</option>
                </select></p>`
    },
    on_load: function () {
      $("option[value=" + (["below primary school", "primary school", "junior middle school", "high school", "university", "master", "doctor", "other"].indexOf(localStorage.getItem(info["subj_idx"]) ? JSON.parse(localStorage.getItem(info["subj_idx"]))["Education"] : "") + 1) + "]").attr("selected", true);
    },
    button_label: '继续',
    on_finish: function (data) {
      let edu = ["below primary school", "primary school", "junior middle school", "high school", "university", "master", "doctor", "other"];
  
      info["Education"] = edu[parseInt(data.response.Q0) - 1];
    }
  }
  ] };
  
  
  timeline.push(information);
  
  
  var chinrest = {
    type: jsPsychVirtualChinrest,
    blindspot_reps: 3,
    resize_units: "deg",
    pixels_per_unit: 50,
    item_path:'img/card.png',
    adjustment_prompt: function(){
      let html = `<p style = "font-size: 28px">首先，我们将快速测量您的显示器上像素到厘米的转换比率。</p>`;
      html += `<p style = "font-size: 28px">请您将拿出一张真实的银行卡放在屏幕上方，单击并拖动图像的右下角，直到它与屏幕上的信用卡大小相同。</p>`;
      html += `<p style = "font-size: 28px">您可以使用与银行卡大小相同的任何卡，如会员卡或驾照，如果您无法使用真实的卡，可以使用直尺测量图像宽度至85.6毫米。</p>`;
      html += `<p style = "font-size: 28px"> 如果对以上操作感到困惑，请参考这个视频： <a href='https://www.naodao.com/public/stim_calibrate.mp4' target='_blank' style='font-size:24px'>参考视频</a></p>`;
      return html
    },
    blindspot_prompt: function(){
      return `<p style="text-align:left">现在，我们将快速测量您和屏幕之间的距离：<br>
      请把您的左手放在 空格键上<br>
      请用右手遮住右眼<br>
      请用您的左眼专注于黑色方块。将注意力集中在黑色方块上。<br>
      如果您已经准备好了就按下 空格键 ，这时红色的球将从右向左移动，并将消失。当球一消失，就请再按空格键<br>
      如果对以上操作感到困惑，请参考这个视频：<a href='https://www.naodao.com/public/stim_calibrate.mp4' target='_blank' style='font-size:24px'>参考视频</a><br>
      <a style="text-align:center">准备开始时，请按空格键。</a></p>`
    },
    blindspot_measurements_prompt: `剩余测量次数：`,
    on_finish: function(data){
      console.log(data)
    },
    redo_measurement_button_label: `还不够接近，请重试`,
    blindspot_done_prompt: `是的`,
    adjustment_button_prompt: `图像大小对准后，请单击此处`,
    viewing_distance_report: `<p>根据您的反应，您坐在离屏幕<span id='distance-estimate' style='font-weight: bold;'></span> 的位置。<br>这大概是对的吗？</p> `,
  };
  
  timeline.push(chinrest)
  
  
  var fullscreen_trial = {
      type: jsPsychFullscreen,
      fullscreen_mode: true,
      message: "<p><span class='add_' style='color:white; font-size: 25px;'> 实验需要全屏模式，实验期间请勿退出全屏。 </span></p >",
      button_label: " <span class='add_' style='color:black; font-size: 20px;'> 点击这里进入全屏</span>"
    }
  
  timeline.push(fullscreen_trial);//将全屏设置放入到时间线里
  
  
  
    function permutation(arr, num) { //定义排列组合的function
      var r = [];
      (function f(t, a, n) {
        if (n == 0) return r.push(t);
        for (var i = 0, l = a.length; i < l; i++) {
          f(t.concat(a[i]), a.slice(0, i).concat(a.slice(i + 1)), n - 1);
        }
      })([], arr, num);
      return r;
    }
  
  
  
  var texts = ["自我", "朋友", "生人"]//储存文字
  
  var key = ['f', 'j']//按键
  //正确率60%
  let acc = 60;
  let view_texts_images = [];
  
  var Instructions1 = {
    type: jsPsychInstructions,
    pages: function () {
      let start = "<p class='header' style = 'font-size: 25px'>请您记住如下对应关系:</p>",
        middle = "<p class='footer'  style = 'font-size: 25px'>如果对本实验还有不清楚之处，请立即向实验员咨询。</p>",
        end = "<p style = 'font-size: 25px; line-height: 30px;'>如果您明白了规则：请点击 继续 进入刺激呈现顺序为<span style='color: yellow;'>先图形后文字条件</span>的练习</span></p><div>";
      let tmpI = "";
      view_texts_images.forEach(v => {
        tmpI += `<p class="content">${v}</p>`;
      });
      return ["<p class='header' style = 'font-size: 25px'>实验说明：</p><p style='color:white; font-size: 25px;line-height: 30px;'>您好，欢迎参加本实验。本次实验大约需要50分钟完成。</p><p style='color:white; font-size: 25px;'>在本实验中，您需要完成一个简单的知觉匹配任务。</p><p style='color:white; font-size: 25px;'>您将学习几种几何图形与不同标签的对应关系。</p>",
        start + `<div class="box">${tmpI}</div>` +
        `<p class='footer' style='font-size: 30px; line-height: 35px;'>您的任务是在不同的要求下，判断屏幕中的几何图形是否为要求中的目标图形，</p><p class='footer' style='color:white; font-size: 25px;'>如果呈现图形为要求图形，请按<span style="color: lightgreen; font-size:25px">${key[0]}键</span></p><p class='footer' style='color:white; font-size: 25px;'>如果所呈现图形不是要求图形，请按<span style="color: lightgreen; font-size:25px"> ${key[1]}键</p></span><p class='footer' style='color:white; font-size: 20px;'>请在实验过程中将您的<span style="color: lightgreen;">食指</span>放在电脑键盘的相应键位上准备按键。</p></span>`,
        `<p style='color:white; font-size: 25px; line-height: 30px;'>您将首先完成三种要求下的练习试次。</p><p style='color:white; font-size: 25px; line-height: 30px;'>练习正确率达标后，您将完成每个条件下的4组匹配任务，每组包括60次按键反应，每组完成后会有休息时间。</p><p style='color:white; font-size: 22px; line-height: 25px;'>完成一组任务大约需要X分钟，整个实验将持续大约X分钟。</p>`,//实验时间待修改
        middle + end];
    },
    show_clickable_nav: true,
    button_label_previous: " <span class='add_' style='color:black; font-size: 20px;'> 返回</span>",
    button_label_next: " <span class='add_' style='color:black; font-size: 20px;'> 继续</span>",
    on_load: () => {
      $("body").css("cursor", "default");
    },
    on_finish: function () {
      $("body").css("cursor", "none");
    } //鼠标消失术，放在要消失鼠标的前一个事件里
  }
  timeline.push(Instructions1);

  let prac_i = {
    timeline:[
    {
    type:jsPsychPsychophysics, 
    stimuli:[
        {
            obj_type: 'cross',
            startX: "center", // location of the cross's center in the canvas
            startY: "center",
            line_length: 40,
            line_width: 5,
            line_color: 'white', // You can use the HTML color name instead of the HEX color.
            show_start_time: 500,
            show_end_time: 1000// ms after the start of the trial
        }, 
        {
            obj_type:"image",
            file: function(){return jsPsych.timelineVariable("Image")},
            startX: "center", // location of the cross's center in the canvas
            startY: "center",
            width: 190,  // 调整图片大小 视角：3.8° x 3.8°
            heigth: 190, // 调整图片大小 视角：3.8° x 3.8°
            show_start_time: 1000, // ms after the start of the trial
            show_end_time: 1050,//出现50ms
            origin_center: true//待确定
        },//上一组end时间减去下一组show时间就是空屏的100ms
        {
            obj_type: 'text',
            startX: "center",
            startY: "center", //图形和文字距离 与加号等距
            content: function () {
              return jsPsych.timelineVariable('word', true)();//记得后面要加括号
            },
            font: `${80}px 'Arial'`, //字体和颜色设置 文字视角：3.6° x 1.6°

            text_color: 'white',
            show_start_time: 1150, // ms after the start of the trial
            show_end_time: 1200,//出现50ms
            origin_center: true//带确定
          }
        ],

    