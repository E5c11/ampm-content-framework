S='/tmp/claude-1000/-home-emmanuel-WebstormProjects-ampm-content-framework/cc9bfb68-ae69-49a8-b2bc-7f0004bb56bf/scratchpad'
import subprocess,re,time,json,sys
M=json.load(open("/home/emmanuel/StudioProjects/AMPM/temp/review/english_fal_nov_p1_2025/manifest.json"))
def adb(c): return subprocess.run(["adb","shell",c],capture_output=True,text=True).stdout
def dump():
    adb("uiautomator dump /sdcard/w.xml")
    return subprocess.run(["adb","exec-out","cat","/sdcard/w.xml"],capture_output=True,text=True).stdout
def bounds(xml,rid):
    m=re.search(r'resource-id="'+re.escape(rid)+r'"[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"',xml)
    if not m: return None
    a,b,c,d=map(int,m.groups());return ((a+c)//2,(b+d)//2)
def tap(p): adb(f"input tap {p[0]} {p[1]}")
def wait(tag,t=30):
    s=time.time()
    while time.time()-s<t:
        x=dump()
        if bounds(x,tag): return x
        time.sleep(1)
    return None
res=[]
for L in M["lessons"]:
    qs=L["questions"]
    if not any(q["presentation"]=="fitb" for q in qs): continue
    adb("am force-stop com.esma.ampm.dev")
    adb(f"am start -W -a android.intent.action.VIEW -d 'https://askmoreprepmore.com/video/{L['videoId']}?subject=english_fal&syllabus=dbe' -n com.esma.ampm.dev/com.esma.ampm.MainActivity")
    wait("lesson_questions_pane"); time.sleep(2)
    for i,q in enumerate(qs):
        if q["presentation"]=="fitb":
            ans=(q["answer"][0] or "").split("|")[0]
            x=dump(); inp=bounds(x,"question_fitb_input_0")
            if not inp: res.append((L["order"],i+1,"NO_INPUT"));print(res[-1]);continue
            tap(inp);time.sleep(1.2)
            missing=[];onsym=False
            for ch in ans:
                x=dump()
                if ch==" ": tag="text_key_space"
                elif ch.isalpha(): tag="text_key_"+ch.upper()
                else: tag="text_key_"+ch
                p=bounds(x,tag)
                if not p and not ch.isalpha() and ch!=" ":
                    sw=bounds(x,"text_key_switch")
                    if sw: tap(sw);time.sleep(0.6);x=dump();p=bounds(x,tag)
                    onsym=True
                elif not p and ch.isalpha():
                    sw=bounds(x,"text_key_switch")
                    if sw: tap(sw);time.sleep(0.6);x=dump();p=bounds(x,tag)
                if not p: missing.append(ch);continue
                tap(p);time.sleep(0.25)
            subprocess.run(["adb","exec-out","screencap","-p"],stdout=open(f"{S}/typed_l{L['order']}_q{i+1}.png","wb"))
            x=dump();done=bounds(x,"text_key_done")
            if not done: res.append((L["order"],i+1,"NO_DONE",ans,missing));print(res[-1]);continue
            tap(done);time.sleep(2);x=dump()
            fb=[t for t in ["correct","incorrect","partial","revealed"] if bounds(x,"question_feedback_"+t)]
            subprocess.run(["adb","exec-out","screencap","-p"],stdout=open(f"{S}/result_l{L['order']}_q{i+1}.png","wb"))
            res.append((L["order"],i+1,"PASS" if fb==["correct"] else "FAIL:"+str(fb),ans,missing));print(res[-1],flush=True)
        # advance
        x=dump();n=bounds(x,"question_next_button")
        if n and i<len(qs)-1: tap(n);time.sleep(1.5)
json.dump(res,open(S+"/answers.json","w"))
