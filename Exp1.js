const jsPsych = initJsPsych({
    /* auto_update_progress_bar: true,
     extensions: {
       type: naodao,
     }*/
     on_finish: function() {
      jsPsych.data.get().localSave('csv', 'exp1' + info["ID"] + '.csv'); 
      document.exitFullscreen(); // 退出全屏
      let bodyNode = document.getElementsByTagName("body"); // 获取Body窗体
            }
     });
  
  
  
  var timeline = [] //设置一个时间线
  
  
  
  
  const images = ['img/C_ambi40.png', 
  'img/S_ambi40.png', 
  'img/H_ambi40.png']; 
  
  const T_image = 'img/T_ambi40.png'
  const T_text = '铅笔'

  const preload = {
      type: jsPsychPreload,
      images: [
        'img/C_ambi40.png', 
  'img/S_ambi40.png', 
  'img/H_ambi40.png',
  'img/T_ambi40.png'
      ],
    }
  timeline.push(preload);//preload图片
  
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
      let sort = Math.floor(Math.random()*texts.length);
      texts.splice(sort, 0, T_text)
      images.splice(sort, 0, T_image)
      view_texts_images = [] //指导语中呈现的图片和文字对应关系
      jsPsych.randomization.shuffle(images).forEach((v, i) => { /*将image随机，需要在随机分配三个对应关系后，练习试次开始前，载入缓冲刺激，如果只是加一个三角的image还需要preload吗*/
        view_texts_images.push(`<img src="${v}" width=150 style="vertical-align:middle">---${texts[images.indexOf(v)]}`); //image编号和文字对应，这里需要修改
        console.log(view_texts_images) 
      })   
  
    }
  }, {
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
  
  
  // var chinrest = {
  //   type: jsPsychVirtualChinrest,
  //   blindspot_reps: 3,
  //   resize_units: "deg",
  //   pixels_per_unit: 50,
  //   item_path:'img/card.png',
  //   adjustment_prompt: function(){
  //     let html = `<p style = "font-size: 28px">首先，我们将快速测量您的显示器上像素到厘米的转换比率。</p>`;
  //     html += `<p style = "font-size: 28px">请您将拿出一张真实的银行卡放在屏幕上方，单击并拖动图像的右下角，直到它与屏幕上的信用卡大小相同。</p>`;
  //     html += `<p style = "font-size: 28px">您可以使用与银行卡大小相同的任何卡,如会员卡或驾照,如果您无法使用真实的卡,可以使用直尺测量图像宽度至85.6毫米。</p>`;
  //     html += `<p style = "font-size: 28px"> 如果对以上操作感到困惑，请参考这个视频： <a href='https://www.naodao.com/public/stim_calibrate.mp4' target='_blank' style='font-size:24px'>参考视频</a></p>`;
  //     return html
  //   },
  //   blindspot_prompt: function(){
  //     return `<p style="text-align:left">现在，我们将快速测量您和屏幕之间的距离：<br>
  //     请把您的左手放在 空格键上<br>
  //     请用右手遮住右眼<br>
  //     请用您的左眼专注于黑色方块。将注意力集中在黑色方块上。<br>
  //     如果您已经准备好了就按下 空格键 ，这时红色的球将从右向左移动，并将消失。当球一消失，就请再按空格键<br>
  //     如果对以上操作感到困惑，请参考这个视频：<a href='https://www.naodao.com/public/stim_calibrate.mp4' target='_blank' style='font-size:24px'>参考视频</a><br>
  //     <a style="text-align:center">准备开始时，请按空格键。</a></p>`
  //   },
  //   blindspot_measurements_prompt: `剩余测量次数：`,
  //   on_finish: function(data){
  //     console.log(data)
  //   },
  //   redo_measurement_button_label: `还不够接近，请重试`,
  //   blindspot_done_prompt: `是的`,
  //   adjustment_button_prompt: `图像大小对准后，请单击此处`,
  //   viewing_distance_report: `<p>根据您的反应，您坐在离屏幕<span id='distance-estimate' style='font-weight: bold;'></span> 的位置。<br>这大概是对的吗？</p> `,
  // };
  
  // timeline.push(chinrest)
  
  
  var fullscreen_trial = {
      type: jsPsychFullscreen,
      fullscreen_mode: true,
      message: "<p><span class='add_' style='color:white; font-size: 25px;'> 实验需要全屏模式，实验期间请勿退出全屏。 </span></p >",
      button_label: " <span class='add_' style='color:black; font-size: 20px;'> 点击这里进入全屏</span>"
    }
  
  timeline.push(fullscreen_trial);//将全屏设置放入到时间线里
  
  function permutation(arr, num) { //定义排列组合的function，没读懂该函数如何实现排列组合？
    var r = [];
    (function f(t, a, n) {
      if (n == 0) return r.push(t);
      for (var i = 0, l = a.length; i < l; i++) {
        f(t.concat(a[i]), a.slice(0, i).concat(a.slice(i + 1)), n - 1);
      }
    })([], arr, num);
    return r;
  }

  var texts = ["好人", "常人", "坏人"]//储存文字
  
  var key = ['f', 'j']//按键
  //正确率60%
  let acc = 60;
  let view_texts_images = [];


  var Instructions1 = {
    type: jsPsychInstructions,
    pages: function () {
      let start = "<p class='header' style = 'font-size: 25px'>请您记住如下对应关系:</p>",
        middle = "<p class='footer'  style = 'font-size: 25px'>如果对本实验还有不清楚之处，请立即向实验员咨询。</p>",
        end = "<p style = 'font-size: 25px; line-height: 30px;'>如果您记住了以下三个对应关系：请点击 继续 </span></p><div>";
      let tmpI = "";
      view_texts_images.forEach(v => {
        tmpI += `<p class="content">${v}</p>`;
      });
      return ["<p class='header' style = 'font-size: 25px'>实验说明：</p><p style='color:white; font-size: 25px;line-height: 30px;'>您好,欢迎参加本实验。本次实验大约需要 X 分钟完成。</p><p style='color:white; font-size: 25px;'>在本实验中，您需要完成一个简单的知觉匹配任务。</p><p style='color:white; font-size: 25px;'>您将学习几种几何图形与不同标签的对应关系。</p>",
        start + `<div class="box">${tmpI}</div>` +
        `<p class='footer' style='font-size: 30px; line-height: 35px;'>您的任务是判断几何图形与文字标签是否匹配，</p><p class='footer' style='color:white; font-size: 25px;'>如果二者匹配，请按<span style="color: lightgreen; font-size:25px">${key[0]}键</span></p><p class='footer' style='color:white; font-size: 25px;'>如果二者不匹配或是出现了新的图形与标签，请按<span style="color: lightgreen; font-size:25px"> ${key[1]}键</p></span><p class='footer' style='color:white; font-size: 20px;'>请在实验过程中将您左右手的<span style="color: lightgreen;">食指</span>放在电脑键盘的相应键位上准备按键。</p></span>`,
        `<p style='color:white; font-size: 25px; line-height: 30px;'>您将首先进入练习部分。<p style='color:white; font-size: 25px; line-height: 30px;'>完成练习之后,您将进入正式试验。正式试验分为4组,每组完成后会有休息时间。</p></span>`,
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


  var Instructions2 = {
    type: jsPsychInstructions,
    pages: function () {
      let start = "<p class='header' style = 'font-size: 25px'>请您记住如下对应关系:</p>",
        middle = "<p class='footer'  style = 'font-size: 25px'>如果对本实验还有不清楚之处，请立即向实验员咨询。</p>",
        end = "<p style = 'font-size: 25px; line-height: 30px;'>如果您明白了规则：请点击 继续 进入练习部分</span></p><div>";
      let tmpI = "";
      view_texts_images.forEach(v => {
        tmpI += `<p class="content">${v}</p>`;
      });
      return ["<p class='header' style = 'font-size: 25px'>实验说明：</p><p style='color:white; font-size: 25px;line-height: 30px;'>您好,欢迎参加本实验。本次实验大约需要 X 分钟完成。</p><p style='color:white; font-size: 25px;'>在本实验中，您需要完成一个简单的知觉匹配任务。</p><p style='color:white; font-size: 25px;'>您将学习几种几何图形与不同标签的对应关系。</p>",
        start + `<div class="box">${tmpI}</div>` +
        `<p class='footer' style='font-size: 30px; line-height: 35px;'>您的任务是判断几何图形与文字标签是否匹配，</p><p class='footer' style='color:white; font-size: 25px;'>如果二者匹配，请按<span style="color: lightgreen; font-size:25px">${key[0]}键</span></p><p class='footer' style='color:white; font-size: 25px;'>如果二者不匹配或出现了新的图形与标签，请按<span style="color: lightgreen; font-size:25px"> ${key[1]}键</p></span><p class='footer' style='color:white; font-size: 20px;'>请在实验过程中将您左右手的<span style="color: lightgreen;">食指</span>放在电脑键盘的相应键位上准备按键。</p></span>`,
        `<p style='color:white; font-size: 25px; line-height: 30px;'>您将首先进入练习部分。<p style='color:white; font-size: 25px; line-height: 30px;'>完成练习之后,您将进入正式试验。正式试验分为4组,每组完成后会有休息时间。</p><p style='color:white; font-size: 22px; line-height: 25px;'>完成一组任务大约需要 X 分钟,整个实验将持续大约 XX 分钟。</p>`,//实验时间待修改
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






  var prac = {
    timeline:[
    {
    type:jsPsychPsychophysics, 
    stimuli:[
        {
            obj_type: 'cross',
            startX: "center", // location of the cross's center in the canvas
            startY: "center",
            line_length: 40, // pixels 视角：0.8° x 0.8°
            line_width: 5,
            line_color: 'white', // You can use the HTML color name instead of the HEX color.
            show_start_time: 500,
            show_end_time: 1100// ms after the start of the trial
        }, 
       {
            obj_type:"image",
            file: function(){return jsPsych.timelineVariable("Image")()},
            startX: "center", // location of the cross's center in the canvas
            startY: -175, 
            width: 190,  // 调整图片大小 视角：3.8° x 3.8°
            heigth: 190, // 调整图片大小 视角：3.8° x 3.8°
            show_start_time: 1000, // ms after the start of the trial
            show_end_time: 1100,//出现50ms
            origin_center: true
        },//上一组end时间减去下一组show时间就是空屏的100ms
        {
            obj_type: 'text',
            file: function(){return jsPsych.timelineVariable("word")},
            startX: "center",
            startY: 175, //图形和文字距离 与加号等距2度
            content: function () {
              return jsPsych.timelineVariable('word', true)();
            },
            font: `${80}px 'Arial'`, //字体和颜色设置 文字视角：3.6° x 1.6°
            text_color: 'white',
            show_start_time: 1000, // ms after the start of the trial
            show_end_time: 1100,//出现50ms
            origin_center: true
          }
        ],

        choices: ['f', 'j'],
    response_start_time:1000,//开始作答时间，第二个刺激开始计算
    trial_duration:2500,//结束时间，一共作答时间持续1500ms
    data:function(){return jsPsych.timelineVariable("identify")},
    on_finish: function(data){
        data.correct_response = jsPsych.timelineVariable("identify", true)();
        data.correct = data.correct_response == data.key_press;//0错1对
        data.Image = jsPsych.timelineVariable("Image", true)();
        data.word = jsPsych.timelineVariable('word', true)();
        data.condition = "prac_simultaneous"
    }
},
{
    data:{
        screen_id: "feedback_test"//这里为反馈
    },
    type:jsPsychHtmlKeyboardResponse,
    stimulus:function(){
        let keypress = jsPsych.data.get().last(1).values()[0].key_press; // 被试按键
          //let trial_keypress = jsPsych.data.get().last(1).values()[0].correct; //该trial正确的按键
          let time = jsPsych.data.get().last(1).values()[0].rt;
          let trial_correct_response = jsPsych.data.get().last(1).values()[0].correct_response;//该trial正确的按键
          if (time > 1500 || time === null) { //大于1500或为null为过慢
            return "<span class='add_' style='color:yellow; font-size: 70px;'> 太慢! </span>"
          } else if (time < 200) { //小于两百为过快反应
            return "<span style='color:yellow; font-size: 70px;'>过快! </span>"
          } else {
            if (keypress == trial_correct_response) { //如果按键 == 正确按键
              return "<span style='color:GreenYellow; font-size: 70px;'>正确! </span>"
            }
            else {
              return "<span style='color:red; font-size: 70px;'>错误! </span>"
            }
          }
    },

    choices:"NO_KEYS",
    trial_duration:500,//500ms反馈
}
],

timeline_variables:[
  {Image:function(){return images[0]}, word:function(){return texts[0]}, identify:function(){return key[0]}},
  {Image:function(){return images[1]}, word:function(){return texts[1]}, identify:function(){return key[0]}},
  {Image:function(){return images[2]}, word:function(){return texts[2]}, identify:function(){return key[0]}},
  {Image:function(){return images[3]}, word:function(){return texts[3]}, identify:function(){return key[0]}},

  // {Image:images[0], word:function(){return texts[1]}, identify:function(){return key[1]}},
  // {Image:images[1], word:function(){return texts[2]}, identify:function(){return key[1]}},
  // {Image:images[2], word:function(){return texts[0]}, identify:function(){return key[1]}},
  // {Image:images[3], word:function(){return texts[1]}, identify:function(){return key[1]}},

  // {Image:images[0], word:function(){return texts[2]}, identify:function(){return key[1]}},
  // {Image:images[1], word:function(){return texts[0]}, identify:function(){return key[1]}},
  // {Image:images[2], word:function(){return texts[1]}, identify:function(){return key[1]}},
  // {Image:images[3], word:function(){return texts[2]}, identify:function(){return key[1]}},

  // {Image:images[0], word:function(){return texts[0]}, identify:function(){return key[0]}},
  // {Image:images[1], word:function(){return texts[1]}, identify:function(){return key[0]}},
  // {Image:images[2], word:function(){return texts[2]}, identify:function(){return key[0]}},
  // {Image:images[3], word:function(){return texts[3]}, identify:function(){return key[0]}},
],
randomize_order:true,
repetitions:2,//正是实验时改为6
on_finish:function(){
    // $("body").css("cursor", "default"); //鼠标出现
}
} 

timeline.push(prac);
jsPsych.run(timeline);