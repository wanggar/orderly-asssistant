"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const slides = [
  {
    id: 1,
    title: "小满熊·AI点餐顾问",
    subtitle: "智能餐饮点餐助手",
    content: "基于AI技术的个性化点餐推荐系统，为餐厅经营者和用餐者提供智能化的点餐体验。",
    type: "title" as const
  },
  {
    id: 2,
    title: "现有点餐方式 & 工具的不足",
    content: {
      left: {
        title: "人工点餐 / 收银员推荐",
        items: [
          "✅ 优点：有人情味，能推销",
          "❌ 高峰期顾客着急，收银员没时间细聊 → 很难做到个性化推荐",
          "❌ 有的顾客反感\"强推\"，体验感差"
        ]
      },
      right: {
        title: "自助点餐机 / 小程序点餐",
        items: [
          "✅ 优点：点单效率快，减少排队",
          "❌ 推荐很机械，只是\"搭配套餐\"，不能因人而异",
          "❌ 顾客常常点完主餐就结账，系统不会智能提醒：是不是要加小食、甜品、分享装",
          "❌ 缺少\"对话感\" → 顾客没感觉被关心或被理解"
        ]
      },
      bottom: {
        title: "优惠券 & 满减活动",
        items: [
          "✅ 优点：拉动销量",
          "❌ 顾客可能为了优惠而点一些自己不想要的东西，反而降低体验",
          "❌ 商家利润被压缩，并没有真正提升单客价值"
        ]
      }
    },
    type: "split" as const
  },
  {
    id: 3,
    title: "一个会认人、懂菜、能说、会卖的AI服务员助手",
    content: {
      sections: [
        {
          title: "经营者需求",
          quote: "在顾客满意的前提下，让客单价尽可能高、翻台率尽可能快。"
        },
        {
          title: "用餐者需求",
          quote: "用最少的精力，点到满足自己口味、场景、预算的合适的菜。"
        },

      ]
    },
    type: "sections" as const
  },
  {
    id: 4,
    title: "核心功能",
    content: {
      table: [
        { feature: "智能菜单问答", description: "通过对话了解菜品信息和特色", solution: "解决菜品信息不明确的问题" },
        { feature: "智能菜品推荐", description: "基于用户偏好和场景推荐合适菜品", solution: "解决选择困难和搭配问题" },
        { feature: "智能购物车管理", description: "自动管理和优化购物车内容", solution: "提升点餐效率和用户体验" }
      ]
    },
    type: "table" as const
  },
  {
    id: 5,
    title: "用户体验流程图",
    content: {
      steps: [
        { step: 1, title: "开始", description: "用户进入点餐界面" },
        { step: 2, title: "小熊问情况", description: "收集人数/场景信息" },
        { step: 3, title: "得到首次搭配推荐", description: "AI生成个性化推荐" },
        { step: 4, title: "用户进行加减/换菜", description: "用户调整菜品选择" },
        { step: 5, title: "跳出加购建议", description: "智能推荐补充菜品" },
        { step: 6, title: "结帐前人均确认", description: "显示人均价格确认" },
        { step: 7, title: "用餐后留下偏好", description: "记录偏好为下次服务" }
      ]
    },
    type: "flow" as const
  },
  {
    id: 6,
    title: "不同人群的用餐场景与加购策略",
    content: {
      scenarios: [
        {
          icon: "🍔",
          group: "独自用餐",
          psychology: "追求方便、快速、轻松，点太多会觉得浪费",
          strategy: "推荐「小份 + 搭配感」",
          examples: [
            "「要不要加一份小食，比如薯条或鸡翅？一个人刚好能吃完。」",
            "「饮品升级为大杯，差价不大，喝得更爽。」"
          ],
          keywords: "小份、升级、刚好"
        },
        {
          icon: "🍗",
          group: "两位顾客（情侣/朋友）",
          psychology: "注重分享感，喜欢尝点不同的东西",
          strategy: "推荐「拼盘 + 氛围感」",
          examples: [
            "「要不要来个小吃拼盘？这样你们可以一起分享。」",
            "「情侣一般会加个甜品一起吃，今天的蛋挞很受欢迎。」",
            "「如果饮料换成分享装，两个人一起喝更划算。」"
          ],
          keywords: "分享、拼盘、甜品"
        },
        {
          icon: "🍟",
          group: "三位以上/家庭顾客",
          psychology: "要照顾每个人口味，爸妈关注份量，小孩喜欢零食甜点",
          strategy: "推荐「全家桶/大拼盘 + 儿童单品」",
          examples: [
            "「全家桶刚好够大家分，孩子再来个甜品就很完整。」",
            "「可以加分享饮品装，更方便大家一起喝。」"
          ],
          keywords: "够吃、分享、孩子喜欢"
        }
      ]
    },
    type: "scenarios" as const
  },
  {
    id: 7,
    title: "Demo 场景列表",
    content: {
      description: "我们会用 3 种不同用餐场景来演示点餐顾问如何运作",
      scenarios: [
        { id: 1, title: "单人快餐场景", description: "快速、高效的个人用餐体验" },
        { id: 2, title: "情侣约会场景", description: "浪漫、贴心的双人用餐推荐" },
        { id: 3, title: "家庭三口之家场景", description: "全面、均衡的家庭用餐方案" }
      ]
    },
    type: "demo" as const
  },
  {
    id: 8,
    title: "下一步规划",
    content: {
      phases: [
        {
          phase: "第1阶段",
          timeline: "第1-2个月",
          title: "门店实践",
          items: [
            "进行试点，输出客单价提升率、推荐接受率",
            "输出简明报告，制作短视频"
          ]
        },
        {
          phase: "第2阶段", 
          timeline: "第3-4月",
          title: "SaaS 化 MVP",
          items: [
            "抽象小程序框架，支持多门店入位",
            "实施到周边 3-5 家餐饮门店"
          ]
        },
        {
          phase: "第3阶段",
          timeline: "第5-6月", 
          title: "市场延伸",
          items: [
            "联系本地生活/美团/微信/小程序餐饮相关项目",
            "转化模型：SaaS 月费 / 收分 / 招商合作"
          ]
        }
      ],
      callout: "把一个家庭餐厅的小创意，做成所有餐饮门店的标配工具"
    },
    type: "roadmap" as const
  }
];

export function Slideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") nextSlide();
      if (event.key === "ArrowLeft") prevSlide();
      if (event.key === "Escape") router.push("/");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  const slide = slides[currentSlide];

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#FFFBF5] via-[#FFF5EB] to-[#FFFBF5] flex flex-col relative overflow-hidden">
      {/* Header with navigation */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/")}
          className="text-[#333333] hover:bg-white/50"
        >
          <Home className="w-4 h-4 mr-2" />
          返回主页
        </Button>
        
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide 
                  ? "bg-[#FF6B2D] scale-125" 
                  : "bg-[#DDDDDD] hover:bg-[#FF6B2D]/50"
              }`}
            />
          ))}
        </div>

        <div className="text-sm text-[#333333] font-medium">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>

      {/* Main slide content */}
      <div className="flex-1 flex items-center justify-center p-8 pt-20 pb-20">
        <div className="w-full max-w-6xl mx-auto">
          {slide.type === "title" && (
            <div className="text-center space-y-8">
              <h1 className="text-6xl font-bold text-[#FF6B2D] mb-4">
                {slide.title}
              </h1>
              <h2 className="text-3xl text-[#333333] mb-8">
                {slide.subtitle}
              </h2>
              <p className="text-xl text-[#666666] max-w-3xl mx-auto leading-relaxed">
                {slide.content}
              </p>
            </div>
          )}

          {slide.type === "split" && typeof slide.content === "object" && "left" in slide.content && (
            <div className="space-y-8">
              <h1 className="text-5xl font-bold text-[#FF6B2D] text-center mb-12">
                {slide.title}
              </h1>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white/70 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-[#FF6B2D] mb-4">
                    {slide.content.left.title}
                  </h3>
                  <ul className="space-y-3">
                    {slide.content.left.items.map((item, index) => (
                      <li key={index} className="text-base text-[#333333] flex items-start">
                        <span className="mr-2 flex-shrink-0">
                          {item.startsWith("✅") || item.startsWith("❌") ? "" : "•"}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white/70 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-[#FF6B2D] mb-4">
                    {slide.content.right.title}
                  </h3>
                  <ul className="space-y-3">
                    {slide.content.right.items.map((item, index) => (
                      <li key={index} className="text-base text-[#333333] flex items-start">
                        <span className="mr-2 flex-shrink-0">
                          {item.startsWith("✅") || item.startsWith("❌") ? "" : "•"}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {"bottom" in slide.content && (
                  <div className="bg-white/70 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-[#FF6B2D] mb-4">
                      {slide.content.bottom.title}
                    </h3>
                    <ul className="space-y-3">
                      {slide.content.bottom.items.map((item, index) => (
                        <li key={index} className="text-base text-[#333333] flex items-start">
                          <span className="mr-2 flex-shrink-0">
                            {item.startsWith("✅") || item.startsWith("❌") ? "" : "•"}
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {slide.type === "sections" && typeof slide.content === "object" && "sections" in slide.content && (
            <div className="space-y-8">
              <h1 className="text-4xl font-bold text-[#FF6B2D] text-center mb-12">
                {slide.title}
              </h1>
              <div className="space-y-8">
                {slide.content.sections.map((section, index) => (
                  <div key={index} className="bg-white/70 rounded-2xl p-8 shadow-lg">
                    <h3 className="text-2xl font-bold text-[#FF6B2D] mb-4">
                      {section.title}
                    </h3>
                    {section.quote && (
                      <blockquote className="text-lg text-[#333333] italic border-l-4 border-[#FF6B2D] pl-4 mb-4">
                        &ldquo;{section.quote}&rdquo;
                      </blockquote>
                    )}
                    
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.type === "table" && typeof slide.content === "object" && "table" in slide.content && (
            <div className="space-y-8">
              <h1 className="text-4xl font-bold text-[#FF6B2D] text-center mb-12">
                {slide.title}
              </h1>
              <div className="bg-white/70 rounded-2xl p-8 shadow-lg">
                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-[#FF6B2D]">
                        <th className="text-left py-4 px-6 text-xl font-bold text-[#FF6B2D]">功能</th>
                        <th className="text-left py-4 px-6 text-xl font-bold text-[#FF6B2D]">描述</th>
                        <th className="text-left py-4 px-6 text-xl font-bold text-[#FF6B2D]">解决痛点</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slide.content.table.map((row, index) => (
                        <tr key={index} className="border-b border-[#DDDDDD] hover:bg-[#FFF5EB]/50">
                          <td className="py-4 px-6 text-lg font-semibold text-[#333333]">{row.feature}</td>
                          <td className="py-4 px-6 text-lg text-[#333333]">{row.description}</td>
                          <td className="py-4 px-6 text-lg text-[#666666]">{row.solution}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {slide.type === "flow" && typeof slide.content === "object" && "steps" in slide.content && (
            <div className="space-y-8">
              <h1 className="text-4xl font-bold text-[#FF6B2D] text-center mb-12">
                {slide.title}
              </h1>
              <div className="flex items-center justify-center overflow-x-auto pb-4">
                <div className="flex items-center space-x-4 min-w-max">
                  {slide.content.steps.map((step, index) => (
                    <div key={index} className="flex items-center">
                      {/* Step Card */}
                      <div className="bg-white/80 rounded-xl p-4 shadow-lg border border-[#FF6B2D]/20 hover:shadow-xl transition-all duration-300 min-w-[180px] max-w-[200px]">
                        <div className="w-10 h-10 bg-[#FF6B2D] text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                          {step.step}
                        </div>
                        <h3 className="text-base font-bold text-[#FF6B2D] text-center mb-2 leading-tight">{step.title}</h3>
                        <p className="text-sm text-[#333333] text-center leading-relaxed">{step.description}</p>
                      </div>
                      
                      {/* Arrow between steps */}
                      {index < slide.content.steps.length - 1 && (
                        <div className="flex items-center justify-center mx-2">
                          <div className="w-8 h-8 text-[#FF6B2D] flex items-center justify-center">
                            <svg 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="3"
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                              className="w-6 h-6"
                            >
                              <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Optional: Add a subtitle or note */}
              <div className="text-center mt-8">
                <p className="text-lg text-[#666666] italic">完整的用户体验旅程，从进入到记录偏好</p>
              </div>
            </div>
          )}


          {slide.type === "scenarios" && typeof slide.content === "object" && "scenarios" in slide.content && (
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-[#FF6B2D] text-center mb-8">
                {slide.title}
              </h1>
              <div className="grid grid-cols-3 gap-6">
                {slide.content.scenarios.map((scenario, index) => (
                  <div key={index} className="bg-white/70 rounded-xl p-6 shadow-lg h-fit">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{scenario.icon}</span>
                      <h3 className="text-xl font-bold text-[#FF6B2D]">{scenario.group}</h3>
                    </div>
                    
                    <div className="space-y-4 mb-4">
                      <div>
                        <h4 className="text-base font-semibold text-[#FF6B2D] mb-2">心理特点</h4>
                        <p className="text-sm text-[#333333] leading-relaxed">{scenario.psychology}</p>
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-[#FF6B2D] mb-2">加购策略</h4>
                        <p className="text-sm text-[#333333] leading-relaxed">{scenario.strategy}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-base font-semibold text-[#FF6B2D] mb-3">话术示例</h4>
                      <div className="space-y-2">
                        {scenario.examples.map((example, exampleIndex) => (
                          <div key={exampleIndex} className="bg-[#FFF5EB] rounded p-3 border-l-2 border-[#FF6B2D]">
                            <p className="text-sm text-[#333333] italic">{example}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#FF6B2D]">关键词：</span>
                      <span className="text-sm text-[#666666] bg-[#FFF5EB] px-3 py-1 rounded-full">
                        {scenario.keywords}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.type === "demo" && typeof slide.content === "object" && "scenarios" in slide.content && (
            <div className="space-y-8">
              <h1 className="text-4xl font-bold text-[#FF6B2D] text-center mb-8">
                {slide.title}
              </h1>
              <p className="text-xl text-[#333333] text-center mb-12">
                {slide.content.description}
              </p>
              <div className="grid grid-cols-3 gap-8">
                {slide.content.scenarios.map((scenario) => (
                  <div key={scenario.id} className="bg-white/70 rounded-2xl p-8 shadow-lg text-center">
                    <div className="w-16 h-16 bg-[#FF6B2D] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                      {scenario.id}
                    </div>
                    <h3 className="text-xl font-bold text-[#333333] mb-4">{scenario.title}</h3>
                    <p className="text-lg text-[#666666]">{scenario.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.type === "roadmap" && typeof slide.content === "object" && "phases" in slide.content && (
            <div className="space-y-8">
              <h1 className="text-4xl font-bold text-[#FF6B2D] text-center mb-12">
                {slide.title}
              </h1>
              <div className="space-y-6">
                {slide.content.phases.map((phase, index) => (
                  <div key={index} className="bg-white/70 rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center mb-4">
                      <span className="text-2xl font-bold text-[#FF6B2D] mr-4">{phase.phase}</span>
                      <span className="text-lg text-[#666666] mr-4">({phase.timeline})</span>
                      <span className="text-xl font-semibold text-[#333333]">{phase.title}</span>
                    </div>
                    <ul className="space-y-3 ml-6">
                      {phase.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-lg text-[#333333] flex items-start">
                          <span className="text-[#FF6B2D] mr-3 text-xl">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-[#FF6B2D] to-[#FF8A50] text-white rounded-2xl p-8 shadow-lg text-center">
                <p className="text-2xl font-bold">{slide.content.callout}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="bg-white/80 border-[#DDDDDD] text-[#333333] hover:bg-[#FF6B2D] hover:text-white hover:border-[#FF6B2D]"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          上一页
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="bg-white/80 border-[#DDDDDD] text-[#333333] hover:bg-[#FF6B2D] hover:text-white hover:border-[#FF6B2D]"
        >
          下一页
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 text-sm text-[#666666] z-10">
        使用 ← → 键切换页面，ESC 键返回主页
      </div>
    </div>
  );
}